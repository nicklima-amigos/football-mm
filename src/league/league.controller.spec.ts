import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { Match } from '../match/entities/match.entity';
import { Player } from '../players/entities/player.entity';

describe('LeagueController', () => {
  let controller: LeagueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([League, Match, Player])],
      controllers: [LeagueController],
      providers: [LeagueService],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
