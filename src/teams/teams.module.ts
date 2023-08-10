import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TeamController } from './teams.controller';
import { teamsRepository } from './teams.providers';
import { TeamService } from './teams.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TeamController],
  providers: [TeamService, teamsRepository],
})
export class TeamModule {}
