import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private repository: Repository<Team>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
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
      throw new HttpException('Team not found', 404);
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    if (updateTeamDto.playerIds) {
      const players = await this.findPlayers(updateTeamDto.playerIds);
      team.players = players;
    }
    team.elo = updateTeamDto.elo ?? team.elo;
    return this.repository.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return this.repository.remove(team);
  }

  private async findPlayers(ids: number[]) {
    return this.playerRepository.find({
      where: { id: In(ids) },
    });
  }
}
