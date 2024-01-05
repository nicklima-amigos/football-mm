import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';
import { PlayersService } from '../players/players.service';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';
import { Foul } from './entities/foul.entity';

@Injectable()
export class FoulsService {
  constructor(
    @InjectRepository(Foul) private repository: Repository<Foul>,
    private playerService: PlayersService,
    private gameService: GamesService,
  ) {}

  async create(createFoulDto: CreateFoulDto) {
    const newFoul = new Foul();
    newFoul.card = createFoulDto.card;
    newFoul.minute = createFoulDto.minute;
    newFoul.game = await this.findGame(createFoulDto.gameId);
    newFoul.offendingPlayer = await this.findPlayer(createFoulDto.offenderId);
    if (createFoulDto.victimId) {
      newFoul.victimPlayer = await this.findPlayer(createFoulDto.victimId);
    }
    return this.repository.save(newFoul);
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

  private async findGame(id: number) {
    return this.gameService.findOne(id);
  }

  private async findPlayer(id: number) {
    return this.playerService.findOne(id);
  }
}
