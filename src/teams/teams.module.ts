import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Player])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
