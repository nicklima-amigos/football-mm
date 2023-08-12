import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import {
  RepositoryMock,
  getRepositoryMock
} from '../../test/mocks/repository';
import { Team } from './entities/team.entity';
import { TeamService } from './teams.service';

describe('TeamService', () => {
  let service: TeamService;
  let repository: RepositoryMock<Team>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Team])],
      providers: [TeamService],
    })
      .overrideProvider(getRepositoryToken(Team))
      .useValue(repository)
      .compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
