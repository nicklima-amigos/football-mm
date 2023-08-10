import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './games/games.module';
import { PlayerModule } from './players/players.module';
import { TeamModule } from './teams/teams.module';

@Module({
  imports: [ConfigModule.forRoot(), TeamModule, PlayerModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
