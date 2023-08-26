import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';

@Module({
  imports: [TypeOrmModule.forFeature([Foul, Player, Game])],
  controllers: [FoulController],
  providers: [FoulService],
})
export class FoulModule {}
