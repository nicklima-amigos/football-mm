import { CreateOffsideDto } from '../../src/offside/dto/create-offside.dto';
import { Offside } from '../../src/offside/entities/offside.entity';
import { fakeGame } from './games.factory';
import { fakePlayer } from './players.factory';
import { faker } from '@faker-js/faker';

export const fakeOffside = (): Offside => ({
  id: faker.number.int(),
  player: fakePlayer(),
  game: fakeGame(),
  minute: faker.number.int({ min: 0, max: 90 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});

export const fakeOffsides = (count: number): Offside[] => {
  const offsides: Offside[] = [];
  for (let i = 0; i < count; i++) {
    offsides.push(fakeOffside());
  }
  return offsides;
};

export const fakeCreateOffsideDto = (): CreateOffsideDto => {
  return {
    playerId: faker.number.int(),
    gameId: faker.number.int(),
    minute: faker.number.int(),
  };
};
