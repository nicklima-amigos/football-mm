import { faker } from '@faker-js/faker';
import { fakeGame } from './games.factory';
import { fakePlayer } from './players.factory';
import { Goal, TeamEnum } from '../../src/goal/entities/goal.entity';

export const fakeGoal = (): Goal => ({
  id: faker.number.int(),
  game: fakeGame(),
  player: fakePlayer(),
  minute: faker.number.int({ min: 0, max: 90 }),
  assist: fakePlayer(),
  team: faker.helpers.enumValue(TeamEnum),
  valid: faker.datatype.boolean(),
});

export const fakeGoals = (count: number): Goal[] => {
  const goals: Goal[] = [];
  for (let i = 0; i < count; i++) {
    goals.push(fakeGoal());
  }
  return goals;
};
