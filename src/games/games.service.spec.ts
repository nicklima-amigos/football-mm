import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock, getRepositoryMock } from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameService } from './games.service';

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
