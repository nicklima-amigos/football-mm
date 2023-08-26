import { faker } from '@faker-js/faker';
import { fakeGame } from './games.factory';
import { fakePlayer } from './players.factory';
import { Goal, TeamEnum } from '../../src/goal/entities/goal.entity';
import { CreateGoalDto } from '../../src/goal/dto/create-goal.dto';

export const fakeGoal = (): Goal => ({
  id: faker.number.int(),
  game: fakeGame(),
  player: fakePlayer(),
  minute: faker.number.int({ min: 0, max: 90 }),
  assist: fakePlayer(),
  team: faker.helpers.enumValue(TeamEnum),
  valid: faker.datatype.boolean(),
});

export const fakeCreateGoalDto = (): CreateGoalDto => ({
  gameId: faker.number.int(),
  authorPlayerId: faker.number.int(),
  minute: faker.number.int({ min: 0, max: 90 }),
  assistPlayerId: faker.number.int(),
  team: faker.helpers.enumValue(TeamEnum),
});

export const fakeGoals = (count: number): Goal[] => {
  const goals: Goal[] = [];
  for (let i = 0; i < count; i++) {
    goals.push(fakeGoal());
  }
  return goals;
};
