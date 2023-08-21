import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/entities/match.entity';
import { Team } from '../teams/entities/team.entity';
import { League } from './entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, Match, Team])],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
