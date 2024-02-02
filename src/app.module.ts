import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { FoulsModule } from './fouls/fouls.module';
import { GamesModule } from './games/games.module';
import { GoalsModule } from './goals/goals.module';
import { LeaguesModule } from './leagues/leagues.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: async (cfg: ConfigType<typeof databaseConfig>) => cfg,
    }),
    TeamsModule,
    PlayersModule,
    GamesModule,
    LeaguesModule,
    AuthModule,
    UsersModule,
    FoulsModule,
    GoalsModule,
  ],
})
export class AppModule {}
