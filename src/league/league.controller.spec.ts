import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Match } from '../match/entities/match.entity';
import { League } from './entities/league.entity';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';

describe('LeagueController', () => {
  let controller: LeagueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        LeagueService,
        {
          provide: getRepositoryToken(Match),
          useValue: getRepositoryMock<Match>(),
        },
        {
          provide: getRepositoryToken(League),
          useValue: getRepositoryMock<League>(),
        },
      ],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
