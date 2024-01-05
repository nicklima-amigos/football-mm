import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { PlayersModule } from '../players/players.module';
import { LeaguesModule } from '../leagues/leagues.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), PlayersModule, LeaguesModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
