import { faker } from '@faker-js/faker';
import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository, UpdateResult } from 'typeorm';
import { fakeLeague } from '../../test/factories/leagues.factory';
import {
  fakeMatch,
  fakeMatchDto,
  fakeMatches,
} from '../../test/factories/matches.factory';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Match } from '../base-game/entities/base-game.entity';
import { League } from '../league/entities/league.entity';
import { Team } from '../teams/entities/team.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { fakeTeams } from '../../test/factories/teams.factory';

describe('MatchController', () => {
  let controller: MatchController;
  let matchRepository: Repository<Match>;
  let leagueRepository: Repository<League>;
  let teamRepository: Repository<Team>;
  let app: NestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useValue: getRepositoryMock<Match>(),
        },
        {
          provide: getRepositoryToken(Team),
          useValue: getRepositoryMock<Team>(),
        },
        {
          provide: getRepositoryToken(League),
          useValue: getRepositoryMock<League>(),
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    leagueRepository = module.get<Repository<League>>(
      getRepositoryToken(League),
    );
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
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
  describe('create', () => {
    it('Should be able to create a new match', async () => {
      const newMatch = fakeMatch();
      const matchDto = fakeMatchDto();
      const league = fakeLeague();
      const [homeTeam, awayTeam] = fakeTeams(2);
      jest.spyOn(leagueRepository, 'findOne').mockResolvedValueOnce(league);
      jest.spyOn(teamRepository, 'findOne').mockResolvedValueOnce(homeTeam);
      jest.spyOn(teamRepository, 'findOne').mockResolvedValueOnce(awayTeam);
      jest.spyOn(matchRepository, 'save').mockResolvedValueOnce(newMatch);
      const response = await supertest(app.getHttpServer())
        .post('/matches')
        .send(matchDto);

      expect(response.status).toEqual(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
    });
  });
  describe('list', () => {
    it('Should be able to list all matches', async () => {
      const matches = fakeMatches(5);
      jest.spyOn(matchRepository, 'find').mockResolvedValueOnce(matches);
      const response = await supertest(app.getHttpServer()).get('/matches');

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toHaveLength(5);
    });
  });
  describe('show', () => {
    it('Should be able to show a match', async () => {
      const match = fakeMatch();
      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(match);
      const response = await supertest(app.getHttpServer()).get(
        `/matches/${match.id}`,
      );
      expect(response.status).toEqual(200);
    });
    it('Should not be able to show a match', async () => {
      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(undefined);
      const response = await supertest(app.getHttpServer()).get(
        `/matches/${faker.number.int()}`,
      );

      expect(response.error).toBeInstanceOf(Error);
      expect(response.status).toEqual(404);
    });
  });

  describe('update', () => {
    it('Should be able to update a match', async () => {
      const match = fakeMatch();

      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(match);
      const updatedMatch = {
        ...match,
        awayTeamScore: 3,
        homeTeamScore: 2,
        updatedAt: new Date(),
      };
      const updateResult: UpdateResult = {
        raw: {},
        affected: 1,
        generatedMaps: [updatedMatch],
      };
      jest.spyOn(matchRepository, 'update').mockResolvedValueOnce(updateResult);
      const response = await supertest(app.getHttpServer())
        .patch(`/matches/${match.id}`)
        .send(match);
      expect(response.status).toEqual(200);
    });
    it('Should not be able to update a match', async () => {
      const match = fakeMatch();

      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(undefined);
      const updatedMatch = {
        ...match,
        awayTeamScore: 3,
        homeTeamScore: 2,
        updatedAt: new Date(),
      };

      const updateResult: UpdateResult = {
        raw: {},
        affected: 1,
        generatedMaps: [updatedMatch],
      };
      jest.spyOn(matchRepository, 'update').mockResolvedValueOnce(updateResult);
      const response = await supertest(app.getHttpServer())
        .patch(`/matches/${match.id}`)
        .send(match);
      expect(response.status).toEqual(404);
    });
  });
  describe('delete', () => {
    it('Should be able to delete a match', async () => {
      const match = fakeMatch();

      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(match);

      jest
        .spyOn(matchRepository, 'remove')
        .mockResolvedValueOnce(Promise.resolve(match));

      const response = await supertest(app.getHttpServer()).delete(
        `/matches/${match.id}`,
      );
      expect(response.status).toEqual(204);
    });

    it('Should not be able to delete a match', async () => {
      const match = fakeMatch();
      jest.spyOn(matchRepository, 'findOne').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete(
        `/matches/${match.id}`,
      );
      expect(response.error).toBeInstanceOf(Error);
      expect(response.status).toEqual(404);
    });
  });
});
