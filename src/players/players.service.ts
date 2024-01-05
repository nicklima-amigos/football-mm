import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repository: Repository<Player>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    return this.repository.save(createPlayerDto);
  }

  findAll() {
    return this.repository.find();
  }

  async findManyByIds(ids: number[]) {
    return this.repository.find({ where: { id: In(ids) } });
  }

  async findOne(id: number) {
    const player = await this.repository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.findOne(id);
    const team = await this.findTeam(updatePlayerDto.teamId);
    player.team = team;
    player.elo = updatePlayerDto.elo;
    return this.repository.save(player);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.repository.remove(player);
  }

  async saveMany(players: Player[]) {
    return this.repository.save(players);
  }

  private async findTeam(id: number) {
    const team = await this.teamRepository.findOne({
      where: { id },
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }
}
