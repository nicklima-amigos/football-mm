import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team])],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
