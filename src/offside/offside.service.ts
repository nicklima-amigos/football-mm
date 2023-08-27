import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOffsideDto } from './dto/create-offside.dto';
import { UpdateOffsideDto } from './dto/update-offside.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offside } from './entities/offside.entity';
import { BaseGame } from '../base-game/entities/base-game.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class OffsideService {
  constructor(
    @InjectRepository(Offside) private repository: Repository<Offside>,
    @InjectRepository(BaseGame) private gameRepository: Repository<BaseGame>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
  ) {}

  async create(createOffsideDto: CreateOffsideDto) {
    const game = await this.gameRepository.findOne({
      where: { id: createOffsideDto.gameId },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const player = await this.playerRepository.findOne({
      where: { id: createOffsideDto.playerId },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return this.repository.save({
      game,
      player,
      minute: createOffsideDto.minute,
    });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const offside = await this.repository.findOne({ where: { id } });
    if (!offside) {
      throw new NotFoundException('Offside not found');
    }
    return offside;
  }

  async update(id: number, updateOffsideDto: UpdateOffsideDto) {
    await this.findOne(id);
    return this.repository.update({ id }, updateOffsideDto);
  }

  async remove(id: number) {
    const offside = await this.findOne(id);
    return this.repository.remove(offside);
  }
}
