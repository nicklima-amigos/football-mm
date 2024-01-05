import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueService } from '../league/league.service';
import { PlayerService } from '../players/players.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private repository: Repository<Game>,
    private leagueService: LeagueService,
    private playerService: PlayerService,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const newGame = new Game();
    newGame.scheduledTime = createGameDto.scheduledTime;
    newGame.homeTeam = await this.findTeam(createGameDto.homeTeamPlayerIds);
    newGame.awayTeam = await this.findTeam(createGameDto.awayTeamPlayerIds);
    if (createGameDto.leagueId) {
      newGame.league = await this.findLeague(createGameDto.leagueId);
    }
    return this.repository.save(newGame);
  }

  findAll() {
    return this.repository.find({ relations: ['homeTeam', 'awayTeam'] });
  }

  async findOne(id: number) {
    const game = await this.repository.findOne({
      where: { id },
      relations: ['homeTeam', 'awayTeam', 'goals', 'fouls'],
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    if (updateGameDto.leagueId) {
      game.league = await this.findLeague(updateGameDto.leagueId);
    }
    if (updateGameDto.homeTeamPlayerIds) {
      game.homeTeam = await this.findTeam(updateGameDto.homeTeamPlayerIds);
    }
    if (updateGameDto.awayTeamPlayerIds) {
      game.awayTeam = await this.findTeam(updateGameDto.awayTeamPlayerIds);
    }
    if (updateGameDto.scheduledTime) {
      game.scheduledTime = updateGameDto.scheduledTime;
    }
    return this.repository.save(game);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.repository.remove(player);
  }

  private async findTeam(ids: number[]) {
    const team = await this.playerService.findManyByIds(ids);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  private async findLeague(id: number) {
    return this.leagueService.findOne(id);
  }
}
