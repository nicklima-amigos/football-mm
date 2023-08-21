import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LeagueService } from './league.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LeagueDto } from './dto/league.dto';

@Controller('leagues')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'League created',
    type: LeagueDto,
  })
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of league found',
    type: [LeagueDto],
  })
  findAll() {
    return this.leagueService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'League found',
    type: LeagueDto,
  })
  findOne(@Param('id') id: string) {
    return this.leagueService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'League updated',
    type: LeagueDto,
  })
  update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
    return this.leagueService.update(+id, updateLeagueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'League deleted',
  })
  remove(@Param('id') id: string) {
    return this.leagueService.remove(+id);
  }
}
