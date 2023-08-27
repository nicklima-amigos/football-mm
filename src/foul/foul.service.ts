import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseGame } from '../base-game/entities/base-game.entity';
import { Player } from '../players/entities/player.entity';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';
import { Foul } from './entities/foul.entity';

@Injectable()
export class FoulService {
  constructor(
    @InjectRepository(Foul) private repository: Repository<Foul>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(BaseGame) private gameRepository: Repository<BaseGame>,
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
    await this.findOne(id);
    return this.repository.update(id, updateFoulDto);
  }

  async remove(id: number) {
    const foul = await this.findOne(id);
    return this.repository.remove(foul);
  }
}
