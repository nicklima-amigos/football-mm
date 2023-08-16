import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakePlayer, fakePlayers } from '../../test/factories/players.factory';
import { Player } from './entities/player.entity';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { getRepositoryMock } from '../../test/mocks/repository';
import { ValidationPipe } from '@nestjs/common';

describe('PlayerController', () => {
  let app: NestApplication;
  let controller: PlayerController;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock(),
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
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
      const players = fakePlayers(10);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(players);
      const expected = JSON.parse(JSON.stringify(players));

      const response = await supertest(app.getHttpServer()).get('/players');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single player when given a valid id', async () => {
      const player = fakePlayer();
      player.id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(player);
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer()).get('/players/1');
      const actual = response.body;

      expect(response.status).toEqual(200);
      expect(actual).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a player', async () => {
      const player = fakePlayer();
      jest.spyOn(repository, 'create').mockReturnValueOnce(player);
      const { id, ...playerInfo } = player;
      const expected = JSON.parse(JSON.stringify(player));

      const response = await supertest(app.getHttpServer())
        .post('/players')
        .send(playerInfo);
      const actual = response.body;
      console.log(actual);

      expect(response.status).toEqual(201);
      expect(actual).toEqual(expected);
    });

    it('should throw an error when given invalid data', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(fakePlayer());

      const response = await supertest(app.getHttpServer())
        .post('/players')
        .send({ foo: 'invalid' });

      expect(response.status).toEqual(400);
    });
  });
});
