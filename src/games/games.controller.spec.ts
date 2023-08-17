import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import {
  fakeGame,
  fakeGameDto,
  fakeGames,
} from '../../test/factories/games.factory';
import { Player } from '../players/entities/player.entity';

describe('GameController', () => {
  let controller: GameController;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: getRepositoryMock<Game>(),
        },
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
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
      const players = fakeGames(10);
      jest.spyOn(gameRepository, 'find').mockResolvedValueOnce(players);
      const expected = JSON.parse(JSON.stringify(players));

      const response = await supertest(app.getHttpServer()).get('/games');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single player when given a valid id', async () => {
      const player = fakeGame();
      player.id = 1;
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(player);
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer()).get('/games/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/games/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a game', async () => {
      const game = fakeGame();
      const gameDto = fakeGameDto();
      gameDto.homeTeamPlayerIds = game.homeTeam.map((player) => player.id);
      gameDto.awayTeamPlayerIds = game.awayTeam.map((player) => player.id);
      jest.spyOn(gameRepository, 'create').mockReturnValueOnce(game);
      const expected = JSON.parse(JSON.stringify(game));

      const response = await supertest(app.getHttpServer())
        .post('/games')
        .send(gameDto);
      const actual = response.body;

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(gameRepository, 'create').mockReturnValue(fakeGame());

      const response = await supertest(app.getHttpServer())
        .post('/games')
        .send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      const player = fakeGame();
      player.id = 1;
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(gameRepository, 'update').mockResolvedValueOnce(undefined);
      const { id, ...playerInfo } = player;

      const response = await supertest(app.getHttpServer())
        .patch('/games/1')
        .send(playerInfo);

      expect(response.status).toEqual(200);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/games/1')
        .send({ name: false, homeTeamScore: 'invalid' });

      expect(response.status).toEqual(400);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .patch('/games/1')
        .send({ name: 'invalid' });

      expect(response.status).toEqual(404);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      const player = fakeGame();
      player.id = 1;
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(gameRepository, 'remove').mockResolvedValueOnce(undefined);

      const response = await supertest(app.getHttpServer()).delete('/games/1');

      expect(response.status).toEqual(204);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).delete('/games/1');

      expect(response.status).toEqual(404);
    });
  });
});
