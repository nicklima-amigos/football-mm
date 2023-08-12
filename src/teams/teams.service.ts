import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TEAMS_REPOSITORY') private repository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const players = await Promise.all(
      createTeamDto.playerIds.map((id) => {
        return this.findOne(id);
      }),
    );
    return this.repository.create({
      name: createTeamDto.name,
      players,
    });
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.repository.update({ id }, updateTeamDto);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return this.repository.remove(team);
  }
}
