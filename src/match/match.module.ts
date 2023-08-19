import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './entities/match.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Match, Team])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
