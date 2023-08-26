import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FoulService } from './foul.service';
import { CreateFoulDto } from './dto/create-foul.dto';
import { UpdateFoulDto } from './dto/update-foul.dto';
import { ApiResponse } from '@nestjs/swagger';
import { FoulDto } from './dto/foul.dto';
import { UpdateResult } from 'typeorm';

@Controller('fouls')
export class FoulController {
  constructor(private readonly foulService: FoulService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: FoulDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createFoulDto: CreateFoulDto) {
    return this.foulService.create(createFoulDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [FoulDto] })
  findAll() {
    return this.foulService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: FoulDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id') id: string) {
    return this.foulService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(@Param('id') id: string, @Body() updateFoulDto: UpdateFoulDto) {
    return this.foulService.update(+id, updateFoulDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param('id') id: string) {
    return this.foulService.remove(+id);
  }
}
