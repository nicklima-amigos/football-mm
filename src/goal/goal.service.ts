import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal) private repository: Repository<Goal>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    const game = await this.gameRepository.findOne({
      where: { id: createGoalDto.gameId },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const player = await this.playerRepository.findOne({
      where: { id: createGoalDto.authorPlayerId },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    if (createGoalDto.assistPlayerId) {
      const assist = await this.playerRepository.findOne({
        where: { id: createGoalDto.assistPlayerId },
      });
      if (!assist) {
        throw new NotFoundException('Assist player not found');
      }
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
