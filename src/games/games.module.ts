import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import { Player } from '../players/entities/player.entity';
import { Game } from './entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
