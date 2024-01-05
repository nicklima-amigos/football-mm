import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';
import { PlayersService } from '../players/players.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private repository: Repository<Goal>,
    private playerService: PlayersService,
    private gameService: GamesService,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    const game = await this.gameService.findOne(createGoalDto.gameId);
    const player = await this.playerService.findOne(
      createGoalDto.authorPlayerId,
    );
    if (createGoalDto.assistPlayerId) {
      const assist = await this.playerService.findOne(
        createGoalDto.assistPlayerId,
      );
      return this.repository.save({ ...createGoalDto, game, player, assist });
    }
    return this.repository.save({ ...createGoalDto, game, player });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const goal = await this.repository.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    await this.findOne(id);
    return this.repository.update(id, updateGoalDto);
  }

  async remove(id: number) {
    const goal = await this.findOne(id);
    return this.repository.remove(goal);
  }
}
