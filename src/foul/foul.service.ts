import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Foul } from './entities/foul.entity';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class FoulService {
  constructor(
    @InjectRepository(Foul) private repository: Repository<Foul>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ) {}

  async create(createFoulDto: CreateFoulDto) {
    const game = await this.gameRepository.findOne({
      where: { id: createFoulDto.gameId },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const offendingPlayer = await this.playerRepository.findOne({
      where: { id: createFoulDto.offenderId },
    });
    if (!offendingPlayer) {
      throw new NotFoundException('Offending player not found');
    }
    if (createFoulDto.victimId) {
      const victimPlayer = await this.playerRepository.findOne({
        where: { id: createFoulDto.victimId },
      });
      if (!victimPlayer) {
        throw new NotFoundException('Victim player not found');
      }
      return this.repository.save({
        ...createFoulDto,
        game,
        offendingPlayer,
        victimPlayer,
      });
    }
    return this.repository.save({ ...createFoulDto, game, offendingPlayer });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const foul = await this.repository.findOne({ where: { id } });
    if (!foul) {
      throw new NotFoundException('Foul not found');
    }
    return foul;
  }

  async update(id: number, updateFoulDto: UpdateFoulDto) {
    const foul = await this.findOne(id);
    return this.repository.save({ ...foul, ...updateFoulDto });
  }

  async remove(id: number) {
    const foul = await this.findOne(id);
    return this.repository.remove(foul);
  }
}
