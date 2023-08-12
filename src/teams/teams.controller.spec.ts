import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryMockProvider } from '../../test/mocks/repository';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

describe('TeamController', () => {
  let controller: TeamController;
  let repository: Repository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [TeamService, getRepositoryMockProvider('TEAMS_REPOSITORY')],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    repository = module.get<Repository<Team>>('TEAMS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
