import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { Game } from '../games/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Player, Game])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
