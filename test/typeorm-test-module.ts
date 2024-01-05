import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../src/players/entities/player.entity';
import { Game } from '../src/games/entities/game.entity';
import { Foul } from '../src/fouls/entities/foul.entity';
import { Goal } from '../src/goals/entities/goal.entity';
import { Team } from '../src/teams/entities/team.entity';
import { User } from '../src/users/entities/user.entity';
import { League } from '../src/leagues/entities/league.entity';

export const TypeOrmTestModule = TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  entities: [Player, Game, Foul, Goal, Team, User, League],
  autoLoadEntities: true,
  synchronize: true,
});
