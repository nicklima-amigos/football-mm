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
} from '../../test/factories/user.factory';
import { getRepositoryMock } from '../../test/mocks/repository';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let app: NestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: getRepositoryMock<User>(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = fakeUsers(10).map((user) => {
        delete user.password;
        return user;
      });
      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);
      const expected = JSON.parse(JSON.stringify(users));

      const response = await supertest(app.getHttpServer()).get('/users');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single user when given a valid id', async () => {
      const user = fakeUser();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      const expected = JSON.parse(JSON.stringify(user));

      const response = await supertest(app.getHttpServer()).get('/users/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });

    it('should return a 404 when given an invalid id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/users/1');

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

      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(null),
        }),
      } as any);

      const expected = JSON.parse(JSON.stringify(user));

      const response = await supertest(app.getHttpServer())
        .post('/users')
        .send(createUserDto);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it("should throw an error when given a username that's already taken", async () => {
      const createUserDto = fakeCreateUserDto();
      const user = fakeUser();
      delete user.player.id;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      createUserDto.player = user.player;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(1),
        }),
      } as any);

      const response = await supertest(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      expect(response.status).toEqual(409);
    });

    it('should return an error when given an e-mail that is already taken', async () => {
      const createUserDto = fakeCreateUserDto();
      const user = fakeUser();
      delete user.player.id;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      createUserDto.player = user.player;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(1),
        }),
      } as any);

      const response = await supertest(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      expect(response.status).toEqual(409);
    });
  });

  describe('update', () => {
    it('should update a user when given valid data', async () => {
      const user = fakeUser();
      const updateUserDto = fakeCreateUserDto();
      updateUserDto.username = user.username;
      updateUserDto.email = user.email;
      updateUserDto.player = user.player;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(null),
        }),
      } as any);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

      const response = await supertest(app.getHttpServer())
        .patch('/users/1')
        .send(updateUserDto);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      const user = fakeUser();
      const updateUserDto = fakeCreateUserDto();
      updateUserDto.username = user.username;
      updateUserDto.email = user.email;
      updateUserDto.player = user.player;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValueOnce(1),
        }),
      } as any);

      const response = await supertest(app.getHttpServer())
        .patch('/users/1')
        .send(updateUserDto);

      expect(response.status).toEqual(409);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = fakeUser();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete('/users/1');

      expect(response.status).toEqual(204);
    });
  });
});
