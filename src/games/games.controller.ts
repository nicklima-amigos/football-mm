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
import { GameService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Game } from './entities/game.entity';
import { UpdateResult } from 'typeorm';
import { GameDto } from './dto/game.dto';

@Controller('games')
@ApiTags('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiResponse({ status: 201, type: GameDto })
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [GameDto] })
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GameDto })
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResult })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
