import { Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeagueService {
  create(createLeagueDto: CreateLeagueDto) {
    return 'This action adds a new league';
  }

  findAll() {
    return `This action returns all league`;
  }

  findOne(id: number) {
    return `This action returns a #${id} league`;
  }

  update(id: number, updateLeagueDto: UpdateLeagueDto) {
    return `This action updates a #${id} league`;
  }

  remove(id: number) {
    return `This action removes a #${id} league`;
  }
}
