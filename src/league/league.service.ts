import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { In, Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League) private repository: Repository<League>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const { name, matchIds } = createLeagueDto;
    const matches = await this.matchRepository.find({
      where: { id: In(matchIds) },
    });
    return this.repository.save({
      name,
      matches,
    });
  }

  findAll() {
    return this.matchRepository.find();
  }

  async findOne(id: number) {
    const league = await this.repository.findOne({ where: { id } });
    if (!league) {
      throw new HttpException('League not found', HttpStatus.NOT_FOUND);
    }
    return league;
  }

  async update(id: number, updateLeagueDto: UpdateLeagueDto) {
    await this.findOne(id);
    return this.repository.update({ id }, updateLeagueDto);
  }

  async remove(id: number) {
    const league = await this.findOne(id);
    return this.repository.remove(league);
  }
}
