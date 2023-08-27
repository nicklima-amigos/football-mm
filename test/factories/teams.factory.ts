import { faker } from '@faker-js/faker';
import { Team } from '../../src/teams/entities/team.entity';
import { fakePlayers } from './players.factory';

export const fakeTeam = (): Team => {
  return {
    id: faker.number.int(),
    name: faker.person.firstName(),
    elo: faker.number.int(),
    players: [...fakePlayers(11)],
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
};

export const fakeTeams = (count: number): Team[] => {
  const teams: Team[] = [];
  for (let i = 0; i < count; i++) {
    teams.push(fakeTeam());
  }
  return teams;
};
