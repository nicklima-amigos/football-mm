import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Match } from '../base-game/entities/base-game.entity';
import { LeagueService } from '../league/league.service';
import { TeamService } from '../teams/teams.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Team } from '../teams/entities/team.entity';
import { League } from '../league/entities/league.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private repository: Repository<Match>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(League) private leagueRepository: Repository<League>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    const league = await this.leagueRepository.findOne({
      where: { id: createMatchDto.leagueId },
    });
    if (!league) {
      throw new NotFoundException('League not found');
    }
    const homeTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.homeTeamId },
    });
    if (!homeTeam) {
      throw new NotFoundException('Home Team not found');
    }
    const awayTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.awayTeamId },
    });
    if (!awayTeam) {
      throw new NotFoundException('Away Team not found');
    }
    return await this.repository.save({
      homeTeam,
      awayTeam,
      league,
      scheduledTime: createMatchDto.scheduledTime,
    });
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    const match = await this.repository.findOne({ where: { id } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async findMany(ids: number[]) {
    return await this.repository.find({ where: { id: In(ids) } });
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    await this.findOne(id);
    return await this.repository.update({ id }, updateMatchDto);
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    return this.repository.remove(match);
  }
}
