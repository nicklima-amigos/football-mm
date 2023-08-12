import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock, getRepositoryMock } from '../../test/mocks/repository';
import { Player } from './entities/player.entity';
import { PlayerService } from './players.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: RepositoryMock<Player>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Player])],
      providers: [PlayerService],
    })
      .overrideProvider(getRepositoryToken(Player))
      .useValue(repository)
      .compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
