import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakePlayer, fakePlayers } from '../../test/factories/players.factory';
import { fakeTeam } from '../../test/factories/teams.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { Team } from '../teams/entities/team.entity';
import { Player } from './entities/player.entity';
import { PlayersController } from './players.controller';
import { PlayersModule } from './players.module';

describe('PlayerController', () => {
  let app: NestApplication;
  let controller: PlayersController;
  let repository: Repository<Player>;
  let teamRepository: Repository<Team>;

  let request: supertest.SuperTest<supertest.Test>;

  let players: Player[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, PlayersModule],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    players = await repository.save(fakePlayers(10));

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of players', async () => {
      const response = await request.get('/players');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.length).toEqual(players.length);
      for (const player of players) {
        expect(actual.map((p: Player) => p.id)).toContain(player.id);
      }
    });
  });

  describe('findOne', () => {
    it('should return a single player when given a valid id', async () => {
      const response = await request.get('/players/' + players[0].id);
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.name).toEqual(players[0].name);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.get('/players/1337');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a player', async () => {
      const player = fakePlayer();
      const { name, birthDate, position } = player;

      const response = await request
        .post('/players')
        .send({ name, birthDate, position });
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.name).toEqual(name);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.post('/players').send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const { id, elo, ...playerInfo } = players[0];
      playerInfo.name = 'updated';

      const updatedPlayerTeam = await teamRepository.save(fakeTeam());

      const response = await request
        .patch('/players/' + id)
        .send({ elo: elo + 1500, teamId: updatedPlayerTeam.id });

      expect(response.status).toEqual(200);
      expect(response.body.team.id).toEqual(updatedPlayerTeam.id);
      expect(response.body.elo).toEqual(elo + 1500);
    });

    it('should update a player without modifying the data that was not sent', async () => {
      const playerTeam = await teamRepository.save(fakeTeam());
      players[0].team = playerTeam;

      await repository.save(players[0]);
      const { id, elo, ...playerInfo } = players[0];
      playerInfo.name = 'updated';

      const response = await request
        .patch('/players/' + id)
        .send({ elo: elo + 1500, teamId: undefined });

      expect(response.status).toEqual(200);
      expect(response.body.team.id).toEqual(playerTeam.id);
      expect(response.body.elo).toEqual(elo + 1500);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request
        .patch('/players/' + players[0])
        .send({ name: false, birthDate: 'invalid' });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request
        .patch('/players/1337')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a player', async () => {
      const response = await request.delete('/players/' + players[0].id);

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.delete('/players/1337');

      expect(response.status).toEqual(404);
    });
  });
});
