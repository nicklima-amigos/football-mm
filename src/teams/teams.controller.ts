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
import { TeamService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDto } from './dto/team.dto';
import { UpdateResponseDto } from '../dto/update.dto';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiResponse({ status: 201, type: TeamDto })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TeamDto] })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TeamDto })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResponseDto })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
