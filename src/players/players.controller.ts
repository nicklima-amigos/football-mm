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
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerService } from './players.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerDto } from './dto/player.dto';
import { UpdateResponseDto } from '../dto/update.dto';

@Controller('players')
@ApiTags('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiResponse({ status: 201, type: PlayerDto })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [PlayerDto] })
  async findAll() {
    return await this.playerService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PlayerDto })
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResponseDto })
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
