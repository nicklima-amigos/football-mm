import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Player } from '../players/entities/player.entity';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';
import * as supertest from 'supertest';
import { fakeTeam, fakeTeams } from '../../test/factories/teams.factory';

describe('TeamController', () => {
  let app: NestApplication;
  let controller: TeamController;
  let repository: Repository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: getRepositoryMock<Team>(),
        },
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));
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
    it('should return a list of teams', async () => {
      const teams = fakeTeams(10);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(teams);
      const expected = JSON.parse(JSON.stringify(teams));

      const response = await supertest(app.getHttpServer()).get('/teams');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single team when given a valid id', async () => {
      const team = fakeTeam();
      team.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(team);
      const expected = JSON.parse(JSON.stringify(team));

      const response = await supertest(app.getHttpServer()).get('/teams/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/teams/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a team', async () => {
      const player = fakeTeam();
      jest.spyOn(repository, 'create').mockReturnValueOnce(player);
      const { id, ...playerInfo } = player;
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer())
        .post('/teams')
        .send(playerInfo);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(fakeTeam());

      const response = await supertest(app.getHttpServer())
        .post('/teams')
        .send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const player = fakeTeam();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      const { id, ...playerInfo } = player;

      const response = await supertest(app.getHttpServer())
        .patch('/teams/1')
        .send(playerInfo);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/teams/1')
        .send({ name: false, birthDate: 'invalid' });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/teams/1')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a team', async () => {
      const player = fakeTeam();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete('/teams/1');

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).delete('/teams/1');

      expect(response.status).toEqual(404);
    });
  });
});
