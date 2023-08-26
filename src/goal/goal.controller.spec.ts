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
});
