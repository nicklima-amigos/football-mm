import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Game } from '../base-game/entities/base-game.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import {
  fakeCreateFoulDto,
  fakeFoul,
  fakeFouls,
} from '../../test/factories/fouls.factory';
import { getRepositoryMock } from '../../test/mocks/repository';
import { BaseGame } from '../base-game/entities/base-game.entity';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';

describe('FoulController', () => {
  let controller: FoulController;
  let foulRepository: Repository<Foul>;
  let gameRepository: Repository<BaseGame>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoulController],
      providers: [
        FoulService,
        {
          provide: getRepositoryToken(Foul),
          useValue: getRepositoryMock<Foul>(),
        },
        {
          provide: getRepositoryToken(BaseGame),
          useValue: getRepositoryMock<BaseGame>(),
        },
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<FoulController>(FoulController);
    foulRepository = module.get<Repository<Foul>>(getRepositoryToken(Foul));
    gameRepository = module.get<Repository<BaseGame>>(
      getRepositoryToken(BaseGame),
    );
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of fouls', async () => {
      const fouls = fakeFouls(10);
      jest.spyOn(foulRepository, 'find').mockResolvedValueOnce(fouls);
      const expected = JSON.parse(JSON.stringify(fouls));

      const response = await supertest(app.getHttpServer()).get('/fouls');
      const actual = response.body;

      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a foul', async () => {
      const foul = fakeFoul();
      jest.spyOn(foulRepository, 'findOne').mockResolvedValueOnce(foul);
      const expected = JSON.parse(JSON.stringify(foul));

      const response = await supertest(app.getHttpServer()).get('/fouls/1');
      const actual = response.body;

      expect(actual).toEqual(expected);
    });

    it('should return a 404 when given an invalid id', async () => {
      jest.spyOn(foulRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/fouls/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a foul', async () => {
      const foul = fakeFoul();
      jest.spyOn(foulRepository, 'save').mockResolvedValueOnce(foul);
      jest
        .spyOn(playerRepository, 'findOne')
        .mockResolvedValueOnce(foul.offendingPlayer);
      jest
        .spyOn(playerRepository, 'findOne')
        .mockResolvedValueOnce(foul.victimPlayer);
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(foul.game);
      const expected = JSON.parse(JSON.stringify(foul));

      const response = await supertest(app.getHttpServer())
        .post('/fouls')
        .send(fakeCreateFoulDto());
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(foulRepository, 'save').mockRejectedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/fouls')
        .send('foo');

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given an invalid player id', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/fouls')
        .send(fakeCreateFoulDto());

      expect(response.status).toEqual(404);
    });

    it('should throw an error when given an invalid game id', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/fouls')
        .send(fakeCreateFoulDto());

      expect(response.status).toEqual(404);
    });
  });

  describe('update', () => {
    it('should update a foul', async () => {
      const foul = fakeFoul();
      foul.id = 1;
      jest.spyOn(foulRepository, 'findOne').mockResolvedValueOnce(foul);
      jest.spyOn(foulRepository, 'update').mockResolvedValueOnce(undefined);
      delete foul.id;

      const response = await supertest(app.getHttpServer())
        .patch('/fouls/1')
        .send(foul);

      expect(response.status).toEqual(200);
    });
  });

  describe('delete', () => {
    it('should delete a foul', async () => {
      const foul = fakeFoul();
      foul.id = 1;
      jest.spyOn(foulRepository, 'findOne').mockResolvedValueOnce(foul);
      jest.spyOn(foulRepository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete('/fouls/1');

      expect(response.status).toEqual(204);
    });
  });
});
