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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDto } from './dto/team.dto';
import { UpdateResponseDto } from '../dto/update.dto';

@Controller('teams')
@ApiTags('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: TeamDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
