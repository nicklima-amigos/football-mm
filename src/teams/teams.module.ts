import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Team, Player])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
