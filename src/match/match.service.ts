import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Team } from '../teams/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private repository: Repository<Match>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    const homeTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.homeTeamId },
    });
    const awayTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.awayTeamId },
    });
    return await this.repository.save({ homeTeam, awayTeam });
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    const match = await this.repository.findOne({ where: { id } });
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    return match;
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