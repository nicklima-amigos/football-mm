import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Game } from '../games/entities/game.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { League } from './entities/league.entity';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League) private repository: Repository<League>,
    @InjectRepository(Game) private matchRepository: Repository<Game>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const { name, gameIds: matchIds } = createLeagueDto;
    const matches = await this.matchRepository.find({
      where: { id: In(matchIds) },
    });
    return this.repository.save({
      name,
      matches,
    });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const league = await this.repository.findOne({ where: { id } });
    if (!league) {
      throw new NotFoundException('League not found');
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
