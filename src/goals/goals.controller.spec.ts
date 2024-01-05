import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { fakeGames } from '../../test/factories/games.factory';
import {
  fakeCreateGoalDto,
  fakeGoals,
} from '../../test/factories/goals.factory';
import { fakePlayers } from '../../test/factories/players.factory';
import { TypeOrmTestModule } from '../../test/typeorm-test-module';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Goal } from './entities/goal.entity';
import { GoalsController } from './goals.controller';
import { GoalsModule } from './goals.module';

describe('GoalController', () => {
  let controller: GoalsController;
  let goalRepository: Repository<Goal>;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

  let players: Player[];
  let games: Game[];
  let goals: Goal[];

  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, GoalsModule],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );

    players = await playerRepository.save(fakePlayers(220));
    games = await gameRepository.save(
      fakeGames(10).map((game, index) => ({
        ...game,
        homeTeam: players.slice(index, index + 11),
        awayTeam: players.slice(index + 11, index + 22),
      })),
    );
    goals = await goalRepository.save(
      fakeGoals(10).map((goal, index) => ({
        ...goal,
        assist: null,
        game: games[index],
        player: players[index],
      })),
    );

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    request = supertest(app.getHttpServer());

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of goals', async () => {
      const response = await request.get('/goals');
      const actual = response.body;

      expect(actual.length).toEqual(goals.length);
      for (const goal of actual) {
        expect(actual.map((g: Goal) => g.id)).toContain(goal.id);
      }
    });
  });

  describe('findOne', () => {
    it('should return a goal', async () => {
      const { id, player } = goals[0];

      const response = await request.get('/goals/' + id);
      const actual = response.body;

      expect(actual.player.name).toEqual(player.name);
    });

    it('should throw an error when given a non existing id', async () => {
      const response = await request.get('/goals/1337');
      expect(response.status).toEqual(404);
    });
  });

  describe('create', () => {
    it('should create a goal', async () => {
      const newGoal = fakeCreateGoalDto();
      newGoal.gameId = games[0].id;
      newGoal.authorPlayerId = players[0].id;
      newGoal.assistPlayerId = null;

      const response = await request.post('/goals').send(newGoal);
      const actual = response.body;

      expect(actual.minute).toEqual(newGoal.minute);
    });

    it('should throw an error when given an invalid game id', async () => {
      const goal = fakeCreateGoalDto();
      goal.gameId = 1337;

      const response = await request.post('/goals').send(goal);

      expect(response.status).toEqual(404);
    });

    it('should throw an error when given an invalid player id', async () => {
      const goal = fakeCreateGoalDto();
      goal.authorPlayerId = 1337;

      const response = await request.post('/goals').send(goal);

      expect(response.status).toEqual(404);
    });
  });
});
