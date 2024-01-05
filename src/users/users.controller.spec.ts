import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import {
  fakeCreateUserDto,
  fakeUser,
  fakeUsers,
} from '../../test/factories/users.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';

describe('UserController', () => {
  let controller: UsersController;
  let app: NestApplication;
  let repository: Repository<User>;

  let users: User[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, UsersModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    users = fakeUsers(10);
    const createUsersPromise = users.map((user) => repository.save(user));
    await Promise.all(createUsersPromise);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const expectedUsers = users.map((user) => {
        delete user.password;
        return user;
      });
      const expected = JSON.parse(JSON.stringify(expectedUsers));

      const response = await request.get('/users');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.length).toEqual(expected.length);
      expected.map((expectedUser: User) => {
        expect(actual.map((user: User) => user.id)).toContain(expectedUser.id);
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user when given a valid id', async () => {
      const user = users[0];
      const expected = JSON.parse(JSON.stringify(user));

      const response = await request.get('/users/' + user.id);
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.username).toEqual(expected.username);
    });

    it('should return a 404 when given an invalid id', async () => {
      const response = await request.get('/users/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a user when given valid data', async () => {
      const createUserDto = fakeCreateUserDto();
      const user = fakeUser();
      delete user.player.id;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      createUserDto.player = user.player;

      const expected = JSON.parse(JSON.stringify(user));

      const response = await request.post('/users').send(createUserDto);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.username).toEqual(expected.username);
    });

    it("should throw an error when given a username that's already taken", async () => {
      const createUserDto = fakeCreateUserDto();
      const user = users[0];
      delete user.player.id;
      createUserDto.username = user.username;

      const response = await request.post('/users').send(createUserDto);

      expect(response.status).toEqual(409);
    });

    it('should return an error when given an e-mail that is already taken', async () => {
      const createUserDto = fakeCreateUserDto();
      const user = fakeUser();
      delete user.player.id;
      user.username = createUserDto.username;
      createUserDto.email = users[0].email;
      createUserDto.player = user.player;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(1),
        }),
      } as any);

      const response = await request.post('/users').send(createUserDto);

      expect(response.status).toEqual(409);
    });
  });

  describe('update', () => {
    it('should update a user when given valid data', async () => {
      const user = users[0];
      const updateUserDto = fakeCreateUserDto();
      updateUserDto.username = user.username;
      updateUserDto.email = user.email;
      updateUserDto.player = user.player;

      const response = await request
        .patch('/users/' + user.id)
        .send(updateUserDto);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      const user = fakeUser();
      const updateUserDto = fakeCreateUserDto();
      updateUserDto.username = 5 as any;
      updateUserDto.email = 'foo';
      updateUserDto.player = false as any;

      const response = await request
        .patch('/users/' + user.id)
        .send(updateUserDto);

      expect(response.status).toEqual(400);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = users[0];

      const response = await request.delete('/users/' + user.id);

      expect(response.status).toEqual(204);
    });
  });
});
