import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private repository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    return this.repository.save(createPlayerDto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const player = await this.repository.findOne({ where: { id } });
    if (!player) {
      throw new HttpException('Player not found', 404);
    }
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    await this.findOne(id);
    return this.repository.update({ id }, updatePlayerDto);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.repository.remove(player);
  }
}
