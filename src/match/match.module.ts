import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from '../base-game/entities/base-game.entity';
import { Team } from '../teams/entities/team.entity';
import { League } from '../league/entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team, League])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
