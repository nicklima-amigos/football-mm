import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Player } from './entities/player.entity';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        getRepositoryMockProvider('PLAYERS_REPOSITORY'),
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    repository = module.get<Repository<Player>>('PLAYERS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
