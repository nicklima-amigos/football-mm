import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakeTeam, fakeTeams } from '../../test/factories/teams.factory';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsModule } from './teams.module';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';

describe('TeamController', () => {
  let app: NestApplication;
  let controller: TeamsController;
  let repository: Repository<Team>;

  let teams: Team[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmTestModule, TeamsModule],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));

    teams = await repository.save(fakeTeams(10));

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    request = supertest(app.getHttpServer());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of teams', async () => {
      const response = await request.get('/teams');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.length).toEqual(teams.length);
      for (const team of teams) {
        expect(actual.map((t) => t.id)).toContain(team.id);
      }
    });
  });

  describe('findOne', () => {
    it('should return a single team when given a valid id', async () => {
      const expected = teams[0];

      const response = await request.get('/teams/' + teams[0].id);
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.name).toEqual(expected.name);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.get('/teams/1337');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a team', async () => {
      const team = fakeTeam();
      delete team.id;

      const response = await request.post('/teams').send(team);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.name).toEqual(team.name);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.post('/teams').send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const { id, ...teamInfo } = teams[0];
      teamInfo.name = 'updated';

      const response = await request.patch('/teams/' + id).send(teamInfo);

      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(teamInfo.name);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request
        .patch('/teams/1')
        .send({ name: false, birthDate: 'invalid' });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request
        .patch('/teams/1337')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a team', async () => {
      const response = await request.delete('/teams/' + teams[0].id);

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.delete('/teams/1337');

      expect(response.status).toEqual(404);
    });
  });
});
