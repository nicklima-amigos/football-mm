import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakePlayer, fakePlayers } from '../../test/factories/players.factory';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Player } from './entities/player.entity';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';

describe('PlayerController', () => {
  let app: NestApplication;
  let controller: PlayerController;
  let repository: Repository<Player>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of players', async () => {
      const players = fakePlayers(10);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(players);
      const expected = JSON.parse(JSON.stringify(players));

      const response = await supertest(app.getHttpServer()).get('/players');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single player when given a valid id', async () => {
      const player = fakePlayer();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer()).get('/players/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/players/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a player', async () => {
      const player = fakePlayer();
      jest.spyOn(repository, 'save').mockResolvedValueOnce(player);
      const { name, birthDate, position } = player;
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer())
        .post('/players')
        .send({ name, birthDate, position });
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(fakePlayer());

      const response = await supertest(app.getHttpServer())
        .post('/players')
        .send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const player = fakePlayer();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      delete player.id;

      const response = await supertest(app.getHttpServer())
        .patch('/players/1')
        .send(player);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/players/1')
        .send({ name: false, birthDate: 'invalid' });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/players/1')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a player', async () => {
      const player = fakePlayer();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete(
        '/players/1',
      );

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).delete(
        '/players/1',
      );

      expect(response.status).toEqual(404);
    });
  });
});
