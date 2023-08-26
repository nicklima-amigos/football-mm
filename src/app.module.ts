import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FoulModule } from './foul/foul.module';
import { GameModule } from './games/games.module';
import { LeagueModule } from './league/league.module';
import { MatchModule } from './match/match.module';
import { OffsideModule } from './offside/offside.module';
import { PlayerModule } from './players/players.module';
import { TeamModule } from './teams/teams.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: +configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    TeamModule,
    PlayerModule,
    GameModule,
    MatchModule,
    LeagueModule,
    AuthModule,
    UserModule,
    FoulModule,
    OffsideModule,
    GoalModule,
  ],
})
export class AppModule {}
