import { Injectable } from '@nestjs/common';
import { CreateOffsideDto } from './dto/create-offside.dto';
import { UpdateOffsideDto } from './dto/update-offside.dto';

@Injectable()
export class OffsideService {
  create(createOffsideDto: CreateOffsideDto) {
    return 'This action adds a new offside';
  }

  findAll() {
    return `This action returns all offside`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offside`;
  }

  update(id: number, updateOffsideDto: UpdateOffsideDto) {
    return `This action updates a #${id} offside`;
  }

  remove(id: number) {
    return `This action removes a #${id} offside`;
  }
}
