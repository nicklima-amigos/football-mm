import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Player, Game])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
