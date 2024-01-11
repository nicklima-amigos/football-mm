import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakeGameDto, fakeGames } from '../../test/factories/games.factory';
import { fakePlayers } from '../../test/factories/players.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { League } from '../leagues/entities/league.entity';
import { Player } from '../players/entities/player.entity';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesModule } from './games.module';
import { fakeLeague } from '../../test/factories/leagues.factory';

describe('GameController', () => {
  let controller: GamesController;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let leagueRepository: Repository<League>;
  let app: NestApplication;

  let games: Game[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, GamesModule],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    leagueRepository = module.get<Repository<League>>(
      getRepositoryToken(League),
    );

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    const gamePromises = fakeGames(10).map(async (game) => {
      return gameRepository.save({
        ...game,
        homeTeam: await playerRepository.save(fakePlayers(11)),
        awayTeam: await playerRepository.save(fakePlayers(11)),
      });
    });

    games = await Promise.all(gamePromises);

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a list of games', async () => {
      const response = await request.get('/games');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.length).toEqual(games.length);
      for (const game of games) {
        expect(actual.map((g: Game) => g.id)).toContain(game.id);
      }
    });
  });

  describe('findOne', () => {
    it('should return a single game when given a valid id', async () => {
      const { id, scheduledTime } = games[0];
      const response = await request.get('/games/' + id);
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual.scheduledTime).toEqual(scheduledTime.toISOString());
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.get('/games/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a game', async () => {
      const game = games[0];
      const gameDto = fakeGameDto();
      gameDto.homeTeamPlayerIds = game.homeTeam.map((player) => player.id);
      gameDto.awayTeamPlayerIds = game.awayTeam.map((player) => player.id);

      const response = await request.post('/games').send(gameDto);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual.scheduledTime).toEqual(gameDto.scheduledTime.toISOString());
    });

    it('should throw an error when given a non existing league', async () => {
      const gameDto = fakeGameDto();
      gameDto.leagueId = 1;

      const response = await request.post('/games').send(gameDto);

      expect(response.status).toEqual(404);
    });

    it('should throw an error when given invalid data', async () => {
      const response = await request.post('/games').send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      const gameDto: UpdateGameDto = {
        leagueId: (await leagueRepository.save(fakeLeague())).id,
      };

      const response = await request
        .patch('/games/' + games[0].id)
        .send(gameDto);

      expect(response.status).toEqual(200);
      expect(response.body.league.id).toEqual(gameDto.leagueId);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request
        .patch('/games/1337')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      const response = await request.delete('/games/' + games[0].id);

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.delete('/games/1');

      expect(response.status).toEqual(404);
    });
  });
});
