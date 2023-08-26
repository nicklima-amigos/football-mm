import { faker } from '@faker-js/faker';
import { Game } from '../../src/games/entities/game.entity';
import { fakePlayers } from './players.factory';
import { CreateGameDto } from '../../src/games/dto/create-game.dto';

export const fakeGame = (): Game => {
  return {
    id: faker.number.int(),
    homeTeam: fakePlayers(11),
    awayTeam: fakePlayers(11),
    goals: [],
    fouls: [],
    offsides: [],
    scheduledTime: faker.date.future(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

export const fakeGameDto = (): CreateGameDto => {
  return {
    homeTeamPlayerIds: fakePlayers(11).map((player) => player.id),
    awayTeamPlayerIds: fakePlayers(11).map((player) => player.id),
    scheduledTime: faker.date.future(),
  };
};

export const fakeGames = (count: number): Game[] => {
  const games: Game[] = [];
  for (let i = 0; i < count; i++) {
    games.push(fakeGame());
  }
  return games;
};
