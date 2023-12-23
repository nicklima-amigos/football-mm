import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../src/players/entities/player.entity';
import { Game } from '../src/games/entities/game.entity';
import { Foul } from '../src/foul/entities/foul.entity';
import { Goal } from '../src/goal/entities/goal.entity';
import { Team } from '../src/teams/entities/team.entity';
import { User } from '../src/user/entities/user.entity';
import { League } from '../src/league/entities/league.entity';

export const TypeOrmTestModule = TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  entities: [Player, Game, Foul, Goal, Team, User, League],
  autoLoadEntities: true,
  synchronize: true,
});
