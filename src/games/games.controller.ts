import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { GameDto } from './dto/game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './games.service';

@Controller('games')
@ApiTags('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: GameDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [GameDto] })
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GameDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
