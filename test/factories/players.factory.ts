import { faker } from '@faker-js/faker';
import { Player } from '../../src/players/entities/player.entity';

export const fakePlayer = (): Player => {
  return {
    id: faker.number.int(),
    name: faker.person.firstName(),
    birthDate: faker.date.past(),
    position: faker.lorem.word(),
    elo: faker.number.int(),
    games: [],
    team: null,
    createdAt: faker.date.recent(),
  };
};

export const fakePlayers = (count: number): Player[] => {
  const players: Player[] = [];
  for (let i = 0; i < count; i++) {
    players.push(fakePlayer());
  }
  return players;
};
