import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';

describe('FoulController', () => {
  let controller: FoulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoulController],
      providers: [
        FoulService,
        {
          provide: getRepositoryToken(Foul),
          useValue: getRepositoryMock<Foul>(),
        },
        {
          provide: getRepositoryToken(Game),
          useValue: getRepositoryMock<Game>(),
        },
        {
          provide: getRepositoryToken(Player),
          useValue: getRepositoryMock<Player>(),
        },
      ],
    }).compile();

    controller = module.get<FoulController>(FoulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
