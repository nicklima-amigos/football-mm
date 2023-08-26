import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';

@Module({
  controllers: [GoalController],
  providers: [GoalService]
})
export class GoalModule {}
