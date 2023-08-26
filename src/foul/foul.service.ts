import { Injectable } from '@nestjs/common';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Foul } from './entities/foul.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FoulService {
  constructor(@InjectRepository(Foul) private repository: Repository<Foul>) {}

  create(createFoulDto: CreateFoulDto) {
    return 'This action adds a new foul';
  }

  findAll() {
    return `This action returns all foul`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foul`;
  }

  update(id: number, updateFoulDto: UpdateFoulDto) {
    return `This action updates a #${id} foul`;
  }

  remove(id: number) {
    return `This action removes a #${id} foul`;
  }
}
