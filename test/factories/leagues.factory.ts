import { faker } from '@faker-js/faker';
import { League } from '../../src/league/entities/league.entity';
import { fakeTeams } from './teams.factory';
import { CreateLeagueDto } from '../../src/league/dto/create-league.dto';
import { fakeMatches } from './matches.factory';

export const fakeLeagueDto = (): CreateLeagueDto => {
  return {
    name: faker.lorem.word(),
    matchIds: fakeMatches(8).map((match) => match.id),
  };
};

export const fakeLeague = (): League => {
  const teams = fakeTeams(8);
  const league = {
    id: faker.number.int(),
    name: faker.lorem.word(),
    matches: [],
    leagueTeams: [],
  };

  league.leagueTeams = teams.map((team) => {
    return {
      id: faker.number.int(),
      team,
    };
  });

  league.matches = teams.map((team, i) => {
    return {
      id: faker.number.int(),
      homeTeam: team,
      awayTeam: teams[i + 1] || teams[0],
      homeTeamScore: faker.number.int({ max: 5 }),
      awayTeamScore: faker.number.int({ max: 5 }),
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
