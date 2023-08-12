import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
  RepositoryMock,
  getRepositoryMock,
  getRepositoryMockProvider,
} from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameService } from './games.service';
import { GameController } from './games.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

describe('GameService', () => {
  let service: GameService;
  let repository: RepositoryMock<Game>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Game])],
      providers: [GameService],
    })
      .overrideProvider(getRepositoryToken(Game))
      .useValue(repository)
      .compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
