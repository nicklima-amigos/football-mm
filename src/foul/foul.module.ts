import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';
import { PlayerModule } from '../players/players.module';
import { GameModule } from '../games/games.module';

@Module({
  imports: [TypeOrmModule.forFeature([Foul]), PlayerModule, GameModule],
  controllers: [FoulController],
  providers: [FoulService],
  exports: [FoulService],
})
export class FoulModule {}
