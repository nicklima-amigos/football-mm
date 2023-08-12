import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock, getRepositoryMock } from '../../test/mocks/repository';
import { Game } from './entities/game.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';

describe('GameController', () => {
  let controller: GameController;
  let repository: RepositoryMock<Game>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Game])],
      controllers: [GameController],
      providers: [GameService],
    })
      .overrideProvider(getRepositoryToken(Game))
      .useValue(repository)
      .compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
