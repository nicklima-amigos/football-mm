import { faker } from '@faker-js/faker';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import { fakeTeam } from './teams.factory';
import { fakeLeague } from './leagues.factory';
import { Match } from '../../src/base-game/entities/base-game.entity';

export const fakeMatchDto = (): CreateMatchDto => {
  return {
    awayTeamId: fakeTeam().id,
    homeTeamId: fakeTeam().id,
  };
};

export const fakeMatch = (): Match => {
  return {
    id: faker.number.int(),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
    league: fakeLeague(),
    homeTeam: fakeTeam(),
    awayTeam: fakeTeam(),
    goals: [],
    fouls: [],
    offsides: [],
    scheduledTime: faker.date.future(),
  };
};

export const fakeMatches = (count: number): Match[] => {
  const matches: Match[] = [];
  for (let i = 0; i < count; i++) {
    matches.push(fakeMatch());
  }
  return matches;
};
