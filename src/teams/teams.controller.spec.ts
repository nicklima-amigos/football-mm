import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock, getRepositoryMock } from '../../test/mocks/repository';
import { Team } from './entities/team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

describe('TeamController', () => {
  let controller: TeamController;
  let repository: RepositoryMock<Team>;

  beforeEach(async () => {
    repository = getRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Team])],
      controllers: [TeamController],
      providers: [TeamService],
    })
      .overrideProvider(getRepositoryToken(Team))
      .useValue(repository)
      .compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
