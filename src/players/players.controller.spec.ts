import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock, getRepositoryMock } from '../../test/mocks/repository';
import { Player } from './entities/player.entity';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let repository: RepositoryMock<Player>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Player])],
      controllers: [PlayerController],
      providers: [PlayerService],
    })
      .overrideProvider(getRepositoryToken(Player))
      .useValue(repository)
      .compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
