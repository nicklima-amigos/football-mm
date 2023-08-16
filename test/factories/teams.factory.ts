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
  };
};

export const fakeTeams = (): Team[] => {
  const teams: Team[] = [];
  for (let i = 0; i < 20; i++) {
    teams.push(fakeTeam());
  }
  return teams;
};
