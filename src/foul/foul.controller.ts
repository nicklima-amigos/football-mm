import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoulService } from './foul.service';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';

@Controller('foul')
export class FoulController {
  constructor(private readonly foulService: FoulService) {}

  @Post()
  create(@Body() createFoulDto: CreateFoulDto) {
    return this.foulService.create(createFoulDto);
  }

  @Get()
  findAll() {
    return this.foulService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foulService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoulDto: UpdateFoulDto) {
    return this.foulService.update(+id, updateFoulDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foulService.remove(+id);
  }
}
