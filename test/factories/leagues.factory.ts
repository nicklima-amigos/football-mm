import { faker } from '@faker-js/faker';
import { CreateLeagueDto } from '../../src/leagues/dto/create-league.dto';
import { League } from '../../src/leagues/entities/league.entity';
import { fakeGames } from './games.factory';
import { fakeTeams } from './teams.factory';
import { fakePlayers } from './players.factory';

export const fakeLeagueDto = (): CreateLeagueDto => {
  return {
    name: faker.lorem.word(),
    gameIds: fakeGames(8).map((match) => match.id),
  };
};

export const fakeLeague = (): League => {
  const teams = fakeTeams(8);
  const league: League = {
    id: faker.number.int(),
    name: faker.lorem.word(),
    matches: [],
  };

  league.matches = teams.map(() => {
    return {
      id: faker.number.int(),
      homeTeam: fakePlayers(11),
      awayTeam: fakePlayers(11),
      goals: [],
      fouls: [],
      scheduledTime: faker.date.future(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  });

  return league;
};

export const fakeLeagues = (count: number) => {
  const leagues: League[] = [];
  for (let i = 0; i < count; i++) {
    leagues.push(fakeLeague());
  }
  return leagues;
};
