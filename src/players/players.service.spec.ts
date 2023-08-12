import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Player } from './entities/player.entity';
import { PlayerService } from './players.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        getRepositoryMockProvider('PLAYERS_REPOSITORY'),
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>('PLAYERS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
