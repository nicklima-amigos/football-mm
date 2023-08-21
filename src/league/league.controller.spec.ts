import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';

describe('LeagueController', () => {
  let controller: LeagueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [LeagueService],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
