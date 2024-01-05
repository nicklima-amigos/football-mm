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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoalDto } from './dto/goal.dto';

@Controller('goals')
@ApiTags('goals')
export class GoalsController {
  constructor(private readonly goalService: GoalsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: GoalDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(createGoalDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [GoalDto] })
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GoalDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: GoalDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
