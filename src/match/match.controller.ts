import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
@ApiTags('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Match created',
    type: MatchDto,
  })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of match found',
    type: [MatchDto],
  })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match found',
    type: MatchDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match updated',
    type: MatchDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Match deleted',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
