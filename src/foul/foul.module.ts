import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';
import { BaseGame } from '../base-game/entities/base-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foul, Player, BaseGame])],
  controllers: [FoulController],
  providers: [FoulService],
})
export class FoulModule {}
