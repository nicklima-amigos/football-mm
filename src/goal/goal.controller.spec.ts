import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

describe('GoalController', () => {
  let controller: GoalController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
