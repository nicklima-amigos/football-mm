import { faker } from '@faker-js/faker';
import { Game } from '../../src/games/entities/game.entity';
import { fakePlayers } from './players.factory';

export const fakeGame = (): Game => {
  return {
    id: faker.number.int(),
    homeTeam: fakePlayers(11),
    awayTeam: fakePlayers(11),
    homeTeamScore: faker.number.int(),
    awayTeamScore: faker.number.int(),
  };
};

export const fakeGames = (): Game[] => {
  const games: Game[] = [];
  for (let i = 0; i < 20; i++) {
    games.push(fakeGame());
  }
  return games;
};
