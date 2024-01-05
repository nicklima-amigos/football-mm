import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import { PlayerModule } from '../players/players.module';
import { LeagueModule } from '../league/league.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), PlayerModule, LeagueModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
