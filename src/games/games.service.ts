import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { League } from '../league/entities/league.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private repository: Repository<Game>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(League) private leagueRepository: Repository<League>,
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
    const team = await this.playerRepository.find({
      where: { id: In(ids) },
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  private async findLeague(id: number) {
    const league = await this.leagueRepository.findOne({
      where: { id },
    });
    if (!league) {
      throw new NotFoundException('League not found');
    }
    return league;
  }
}
