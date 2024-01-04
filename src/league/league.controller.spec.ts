import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import {
  fakeLeague,
  fakeLeagueDto,
  fakeLeagues,
} from '../../test/factories/leagues.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { Game } from '../games/entities/game.entity';
import { PlayerService } from '../players/players.service';
import { League } from './entities/league.entity';
import { LeagueController } from './league.controller';
import { LeagueModule } from './league.module';

describe('LeagueController', () => {
  let controller: LeagueController;
  let repository: Repository<League>;
  let gameRepository: Repository<Game>;
  let playerService: PlayerService;
  let app: NestApplication;

  let leagues: League[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, LeagueModule],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
    repository = module.get<Repository<League>>(getRepositoryToken(League));

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    repository = module.get<Repository<League>>(getRepositoryToken(League));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerService = module.get<PlayerService>(PlayerService);

    leagues = await repository.save(fakeLeagues(10));

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of leagues', async () => {
      const response = await request.get('/leagues');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.length).toEqual(leagues.length);
      leagues.forEach((league) => {
        expect(actual.map((l: League) => l.id)).toContain(league.id);
      });
    });
  });

  describe('findOne', () => {
    it('should return a single league when given a valid id', async () => {
      const response = await request.get('/leagues/' + leagues[0].id);
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.name).toEqual(leagues[0].name);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.get('/leagues/1337');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a league', async () => {
      const league = fakeLeague();
      const matchesPromises = league.matches.map(async (match) => {
        await playerService.saveMany([...match.homeTeam, ...match.awayTeam]);
        return gameRepository.save(match);
      });
      const matches = await Promise.all(matchesPromises);
      const savedMatches = await gameRepository.save(matches);
      league.matches = savedMatches;

      const response = await request.post('/leagues').send({
        name: league.name,
        gameIds: league.matches.map((match) => match.id),
      });
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.name).toEqual(league.name);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.post('/leagues').send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a league', async () => {
      const { id, ...leagueInfo } = leagues[0];
      const league = fakeLeagueDto();
      league.gameIds = leagueInfo.matches.map((match) => match.id);
      league.name = 'updated';

      const response = await request.patch('/leagues/' + id).send(league);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.patch('/leagues/1').send({ name: false });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request
        .patch('/leagues/1')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a league', async () => {
      const response = await request.delete('/leagues/' + leagues[0].id);

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.delete('/leagues/1337');

      expect(response.status).toEqual(404);
    });
  });
});
