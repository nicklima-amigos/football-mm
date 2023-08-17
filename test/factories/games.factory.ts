import { faker } from '@faker-js/faker';
import { Game } from '../../src/games/entities/game.entity';
import { fakePlayers } from './players.factory';
import { CreateGameDto } from '../../src/games/dto/create-game.dto';

export const fakeGame = (): Game => {
  return {
    id: faker.number.int(),
    homeTeam: fakePlayers(11),
    awayTeam: fakePlayers(11),
    homeTeamScore: faker.number.int(),
    awayTeamScore: faker.number.int(),
  };
};

export const fakeGameDto = (): CreateGameDto => {
  return {
    homeTeamPlayerIds: fakePlayers(11).map((player) => player.id),
    awayTeamPlayerIds: fakePlayers(11).map((player) => player.id),
  };
};

export const fakeGames = (count: number): Game[] => {
  const games: Game[] = [];
  for (let i = 0; i < count; i++) {
    games.push(fakeGame());
  }
  return games;
};
