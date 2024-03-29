import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersService } from '../players/players.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private repository: Repository<Team>,
    private playerService: PlayersService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const players = await this.findPlayers(createTeamDto.playerIds);
    return this.repository.save({
      name: createTeamDto.name,
      players,
    });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const team = await this.repository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    if (updateTeamDto.playerIds) {
      const players = await this.findPlayers(updateTeamDto.playerIds);
      team.players = players;
    }
    return this.repository.save({
      ...team,
      ...updateTeamDto,
    });
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return this.repository.remove(team);
  }

  private async findPlayers(ids: number[]) {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.playerService.findManyByIds(ids);
  }
}
