import { Module } from '@nestjs/common';
import { OffsideService } from './offside.service';
import { OffsideController } from './offside.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offside } from './entities/offside.entity';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offside, Player, Game])],
  controllers: [OffsideController],
  providers: [OffsideService],
})
export class OffsideModule {}
