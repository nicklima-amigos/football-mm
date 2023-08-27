import { Module } from '@nestjs/common';
import { OffsideService } from './offside.service';
import { OffsideController } from './offside.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offside } from './entities/offside.entity';
import { Player } from '../players/entities/player.entity';
import { BaseGame } from '../base-game/entities/base-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offside, Player, BaseGame])],
  controllers: [OffsideController],
  providers: [OffsideService],
})
export class OffsideModule {}
