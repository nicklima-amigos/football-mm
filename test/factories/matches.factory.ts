import { faker } from '@faker-js/faker';
import { Match } from 'src/match/entities/match.entity';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import { fakeTeam } from './teams.factory';

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
    homeTeam: fakeTeam(),
    awayTeam: fakeTeam(),
    homeTeamScore: faker.number.int({ max: 5 }),
    awayTeamScore: faker.number.int({ max: 5 }),
  };
};

export const fakeMatches = (count: number): Match[] => {
  const matches: Match[] = [];
  for (let i = 0; i < count; i++) {
    matches.push(fakeMatch());
  }
  return matches;
};
