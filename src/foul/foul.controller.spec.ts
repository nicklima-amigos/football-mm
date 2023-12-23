import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import {
  fakeCreateFoulDto,
  fakeFouls,
} from '../../test/factories/fouls.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulModule } from './foul.module';

describe('FoulController', () => {
  let controller: FoulController;
  let foulRepository: Repository<Foul>;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  let fouls: Foul[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, FoulModule],
    }).compile();

    controller = module.get<FoulController>(FoulController);
    foulRepository = module.get<Repository<Foul>>(getRepositoryToken(Foul));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    const newFouls = fakeFouls(10);
    fouls = await foulRepository.save(
      await Promise.all(
        newFouls.map(async (foul) => ({
          ...foul,
          offendingPlayer: await playerRepository.save(foul.offendingPlayer),
          victimPlayer: await playerRepository.save(foul.victimPlayer),
          game: await gameRepository.save({
            ...foul.game,
            homeTeam: await playerRepository.save(foul.game.homeTeam),
            awayTeam: await playerRepository.save(foul.game.awayTeam),
          }),
        })),
      ),
    );

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of fouls', async () => {
      const response = await request.get('/fouls');
      const actual = response.body;

      expect(actual.length).toEqual(fouls.length);
      fouls.map((foul) => {
        expect(actual.map((foul) => foul.id)).toContain(foul.id);
      });
    });
  });

  describe('findOne', () => {
    it('should return a foul', async () => {
      const { id, minute } = fouls[0];

      const response = await request.get('/fouls/' + id);
      const actual = response.body;

      expect(actual.minute).toEqual(minute);
    });

    it('should return a 404 when given an invalid id', async () => {
      const response = await request.get('/fouls/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a foul', async () => {
      const createFoulDto = fakeCreateFoulDto();
      createFoulDto.offenderId = fouls[0].offendingPlayer.id;
      createFoulDto.victimId = fouls[0].victimPlayer.id;
      createFoulDto.gameId = fouls[0].game.id;

      const response = await request.post('/fouls').send(createFoulDto);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.offendingPlayer.id).toEqual(createFoulDto.offenderId);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.post('/fouls').send('foo');

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given an invalid player id', async () => {
      const response = await request.post('/fouls').send(fakeCreateFoulDto());

      expect(response.status).toEqual(404);
    });

    it('should throw an error when given an invalid game id', async () => {
      const response = await request.post('/fouls').send(fakeCreateFoulDto());

      expect(response.status).toEqual(404);
    });
  });

  describe('update', () => {
    it('should update a foul', async () => {
      const foulDto = fakeCreateFoulDto();
      const { id } = fouls[0];

      const response = await request.patch('/fouls/' + id).send(foulDto);

      expect(response.status).toEqual(200);
      expect(response.body.minute).toEqual(foulDto.minute);
    });
  });

  describe('delete', () => {
    it('should delete a foul', async () => {
      const response = await request.delete('/fouls/' + fouls[0].id);

      expect(response.status).toEqual(204);
    });
  });
});
