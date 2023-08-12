import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';

describe('GameController', () => {
  let controller: GameController;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService, getRepositoryMockProvider('GAMES_REPOSITORY')],
    }).compile();

    controller = module.get<GameController>(GameController);
    repository = module.get<Repository<Game>>('GAMES_REPOSITORY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
