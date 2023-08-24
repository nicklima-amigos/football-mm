import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getRepositoryMock } from '../../test/mocks/repository';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  fakeCreateUserDto,
  fakeUser,
  fakeUsers,
} from '../../test/factories/user.factory';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from '../players/dto/create-player.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
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
    service = module.get<UserService>(UserService);
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
});
