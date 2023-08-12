import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Team } from './entities/team.entity';
import { TeamService } from './teams.service';

describe('TeamService', () => {
  let service: TeamService;
  let repository: Repository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamService, getRepositoryMockProvider('TEAMS_REPOSITORY')],
    }).compile();

    service = module.get<TeamService>(TeamService);
    repository = module.get<Repository<Team>>('TEAMS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
