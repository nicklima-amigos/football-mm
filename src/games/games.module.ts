import { Module } from '@nestjs/common';
import { GameService } from './games.service';
import { GameController } from './games.controller';
import { DatabaseModule } from 'src/database/database.module';
import { gamesRepository } from './games.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [GameService, gamesRepository],
})
export class GameModule {}
