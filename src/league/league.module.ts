import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from '../teams/teams.module';
import { League } from './entities/league.entity';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import { Team } from '../teams/entities/team.entity';
import { Match } from '../base-game/entities/base-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, Team, Match])],
  controllers: [LeagueController],
  providers: [LeagueService],
  exports: [LeagueService],
})
export class LeagueModule {}
