import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
