import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { League } from './entities/league.entity';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import * as supertest from 'supertest';
import { fakeLeagues, fakeLeague } from '../../test/factories/leagues.factory';
import { Repository } from 'typeorm';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Game } from '../games/entities/game.entity';

describe('LeagueController', () => {
  let controller: LeagueController;
  let repository: Repository<League>;
  let app: NestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        LeagueService,
        {
          provide: getRepositoryToken(Game),
          useValue: getRepositoryMock<Game>(),
        },
        {
          provide: getRepositoryToken(League),
          useValue: getRepositoryMock<League>(),
        },
      ],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
    repository = module.get<Repository<League>>(getRepositoryToken(League));

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
    it('should return a list of leagues', async () => {
      const leagues = fakeLeagues(10);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(leagues);
      const expected = JSON.parse(JSON.stringify(leagues));

      const response = await supertest(app.getHttpServer()).get('/leagues');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single league when given a valid id', async () => {
      const league = fakeLeague();
      league.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(league);
      const expected = JSON.parse(JSON.stringify(league));

      const response = await supertest(app.getHttpServer()).get('/leagues/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/leagues/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a league', async () => {
      const league = fakeLeague();
      jest.spyOn(repository, 'save').mockResolvedValueOnce(league);
      const expected = JSON.parse(JSON.stringify(league));

      const response = await supertest(app.getHttpServer())
        .post('/leagues')
        .send({
          name: league.name,
          gameIds: league.matches.map((match) => match.id),
        });
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(null);

      const response = await supertest(app.getHttpServer())
        .post('/leagues')
        .send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a league', async () => {
      const league = fakeLeague();
      league.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(league);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      delete league.id;

      const response = await supertest(app.getHttpServer())
        .patch('/leagues/1')
        .send(league);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/leagues/1')
        .send({ name: false });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/leagues/1')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a league', async () => {
      const league = fakeLeague();
      league.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(league);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete(
        '/leagues/1',
      );

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).delete(
        '/leagues/1',
      );

      expect(response.status).toEqual(404);
    });
  });
});
