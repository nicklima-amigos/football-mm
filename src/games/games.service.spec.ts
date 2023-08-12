import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameService } from './games.service';

describe('GameService', () => {
  let service: GameService;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, getRepositoryMockProvider('GAMES_REPOSITORY')],
    }).compile();

    service = module.get<GameService>(GameService);
    repository = module.get<Repository<Game>>('GAMES_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
