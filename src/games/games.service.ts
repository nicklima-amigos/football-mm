import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private repository: Repository<Game>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const homeTeam = await this.playerRepository.find({
      where: { id: In(createGameDto.homeTeamPlayerIds) },
    });
    const awayTeam = await this.playerRepository.find({
      where: { id: In(createGameDto.awayTeamPlayerIds) },
    });
    return this.repository.save({ homeTeam, awayTeam });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const game = await this.repository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    await this.findOne(id);
    return this.repository.update({ id }, updateGameDto);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.repository.remove(player);
  }
}
