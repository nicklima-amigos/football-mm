import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foul } from './entities/foul.entity';
import { FoulsController } from './fouls.controller';
import { FoulsService } from './fouls.service';
import { PlayersModule } from '../players/players.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [TypeOrmModule.forFeature([Foul]), PlayersModule, GamesModule],
  controllers: [FoulsController],
  providers: [FoulsService],
  exports: [FoulsService],
})
export class FoulsModule {}
