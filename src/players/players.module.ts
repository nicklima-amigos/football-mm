import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team])],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
