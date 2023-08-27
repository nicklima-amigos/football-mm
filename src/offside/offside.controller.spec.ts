import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import {
  fakeCreateOffsideDto,
  fakeOffside,
} from '../../test/factories/offsides.factory';
import { getRepositoryMock } from '../../test/mocks/repository';
import { BaseGame } from '../base-game/entities/base-game.entity';
import { Player } from '../players/entities/player.entity';
import { Offside } from './entities/offside.entity';
import { OffsideController } from './offside.controller';
import { OffsideService } from './offside.service';
import { fakePlayer } from '../../test/factories/players.factory';
import { fakeGame } from '../../test/factories/games.factory';

describe('OffsideController', () => {
  let controller: OffsideController;
  let offsideRepository: Repository<Offside>;
  let gameRepository: Repository<BaseGame>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffsideController],
      providers: [
        OffsideService,
        {
          provide: getRepositoryToken(Offside),
          useValue: getRepositoryMock<Offside>(),
        },
        {
          provide: getRepositoryToken(BaseGame),
          useValue: getRepositoryMock<BaseGame>(),
        },
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<OffsideController>(OffsideController);
    offsideRepository = module.get<Repository<Offside>>(
      getRepositoryToken(Offside),
    );
    gameRepository = module.get<Repository<BaseGame>>(
      getRepositoryToken(BaseGame),
    );
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new offside', async () => {
      const newOffside = new Offside();
      const offsideDto = fakeCreateOffsideDto();
      const player = fakePlayer();
      const game = fakeGame();
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(game);
      jest.spyOn(playerRepository, 'findOne').mockResolvedValueOnce(player);
      jest.spyOn(offsideRepository, 'save').mockResolvedValueOnce(newOffside);

      const response = await supertest(app.getHttpServer())
        .post('/offsides')
        .send(offsideDto)
        .expect(201);

      expect(response.body).toEqual(newOffside);
    });
  });

  describe('list', () => {
    it('should list all offsides', async () => {
      const offsides = [new Offside(), new Offside()];
      jest.spyOn(offsideRepository, 'find').mockResolvedValueOnce(offsides);

      const response = await supertest(app.getHttpServer()).get('/offsides');

      expect(response.body).toEqual(offsides);
    });
  });

  describe('findOne', () => {
    it('should return an offside', async () => {
      const offside = new Offside();
      jest.spyOn(offsideRepository, 'findOne').mockResolvedValueOnce(offside);

      const response = await supertest(app.getHttpServer()).get('/offsides/1');

      expect(response.body).toEqual(offside);
    });

    it('should return a 404 when given an invalid id', async () => {
      jest.spyOn(offsideRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/offsides/1');

      expect(response.status).toEqual(404);
    });
  });

  describe('update', () => {
    it('should update an offside', async () => {
      const offside = new Offside();
      const offsideDto = fakeCreateOffsideDto();
      jest.spyOn(offsideRepository, 'findOne').mockResolvedValueOnce(offside);
      jest.spyOn(offsideRepository, 'save').mockResolvedValueOnce(offside);

      const response = await supertest(app.getHttpServer())
        .patch('/offsides/1')
        .send(offsideDto);

      expect(response.body).toEqual(offside);
    });
  });

  describe('delete', () => {
    it('should delete an offside', async () => {
      const offside = fakeOffside();
      jest.spyOn(offsideRepository, 'findOne').mockResolvedValueOnce(offside);

      const response = await supertest(app.getHttpServer()).delete(
        '/offsides/1',
      );

      expect(response.status).toEqual(200);
    });
  });
});
