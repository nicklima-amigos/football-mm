import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Player])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
