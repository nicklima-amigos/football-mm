import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { User } from '../../src/user/entities/user.entity';
import { fakeCreatePlayerDto, fakePlayer } from './players.factory';

export const fakeUser = (): User => {
  return {
    id: faker.number.int(),
    username: faker.string.alphanumeric({ length: 30 }),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    player: fakePlayer(),
  };
};

export const fakeCreateUserDto = (): CreateUserDto => {
  const password = faker.internet.password();
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password,
    confirmPassword: password,
    player: fakeCreatePlayerDto(),
  };
};

export const fakeUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(fakeUser());
  }
  return users;
};
