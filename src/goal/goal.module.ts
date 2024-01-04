import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { PlayerModule } from '../players/players.module';
import { GameModule } from '../games/games.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), PlayerModule, GameModule],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
