import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { Repository } from 'typeorm';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  fakeCreateGoalDto,
  fakeGoal,
  fakeGoals,
} from '../../test/factories/goals.factory';
import * as supertest from 'supertest';

describe('GoalController', () => {
  let controller: GoalController;
  let goalRepository: Repository<Goal>;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useValue: getRepositoryMock<Goal>(),
        },
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

    controller = module.get<GoalController>(GoalController);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
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

  describe('findAll', () => {
    it('should return a list of goals', async () => {
      const goals = fakeGoals(10);
      jest.spyOn(goalRepository, 'find').mockResolvedValueOnce(goals);
      const expected = JSON.parse(JSON.stringify(goals));

      const response = await supertest(app.getHttpServer()).get('/goals');
      const actual = response.body;

      expect(actual).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a goal', async () => {
      const goal = fakeGoals(1)[0];
      jest.spyOn(goalRepository, 'findOne').mockResolvedValueOnce(goal);
      const expected = JSON.parse(JSON.stringify(goal));

      const response = await supertest(app.getHttpServer()).get('/goals/1');
      const actual = response.body;

      expect(actual).toEqual(expected);
    });

    it('should throw an error when given a non existing id', async () => {
      jest.spyOn(goalRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer()).get('/goals/1');
      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a goal', async () => {
      const goal = fakeGoal();
      jest.spyOn(goalRepository, 'save').mockResolvedValueOnce(goal);
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(goal.game);
      jest
        .spyOn(playerRepository, 'findOne')
        .mockResolvedValueOnce(goal.player);
      jest
        .spyOn(playerRepository, 'findOne')
        .mockResolvedValueOnce(goal.assist);
      const expected = JSON.parse(JSON.stringify(goal));

      const response = await supertest(app.getHttpServer())
        .post('/goals')
        .send(fakeCreateGoalDto());
      const actual = response.body;

      expect(actual).toEqual(expected);
    });

    it('should throw an error when given an invalid game id', async () => {
      const goal = fakeGoals(1)[0];
      jest.spyOn(goalRepository, 'save').mockResolvedValueOnce(goal);
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/goals')
        .send(fakeCreateGoalDto());
      console.log(response.body);

      expect(response.status).toEqual(404);
    });

    it('should throw an error when given an invalid player id', async () => {
      const goal = fakeGoals(1)[0];
      jest.spyOn(goalRepository, 'save').mockResolvedValueOnce(goal);
      jest.spyOn(gameRepository, 'findOne').mockResolvedValueOnce(goal.game);
      jest.spyOn(playerRepository, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app.getHttpServer())
        .post('/goals')
        .send(fakeCreateGoalDto());
      console.log(response.body);

      expect(response.status).toEqual(404);
    });
  });
});
