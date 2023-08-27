import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseGame } from '../base-game/entities/base-game.entity';
import { Player } from '../players/entities/player.entity';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Player, BaseGame])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
