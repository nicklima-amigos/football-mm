import { Card, Foul } from '../../src/foul/entities/foul.entity';
import { faker } from '@faker-js/faker';
import { fakePlayer } from './players.factory';
import { fakeGame } from './games.factory';
import { CreateFoulDto } from '../../src/foul/dto/create-foul.dto';

export const fakeFoul = (): Foul => ({
  id: faker.number.int(),
  offendingPlayer: fakePlayer(),
  victimPlayer: fakePlayer(),
  game: fakeGame(),
  card: faker.helpers.enumValue(Card),
  minute: faker.number.int({ min: 0, max: 90 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});

export const fakeCreateFoulDto = (): CreateFoulDto => ({
  offenderId: fakePlayer().id,
  victimId: fakePlayer().id,
  gameId: fakeGame().id,
  card: faker.helpers.enumValue(Card),
  minute: faker.number.int({ min: 0, max: 90 }),
});

export const fakeFouls = (count: number): Foul[] => {
  const fouls: Foul[] = [];
  for (let i = 0; i < count; i++) {
    fouls.push(fakeFoul());
  }
  return fouls;
};
