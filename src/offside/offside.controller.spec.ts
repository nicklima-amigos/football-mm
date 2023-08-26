import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Offside } from './entities/offside.entity';
import { OffsideController } from './offside.controller';
import { OffsideService } from './offside.service';

describe('OffsideController', () => {
  let controller: OffsideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffsideController],
      providers: [
        OffsideService,
        {
          provide: getRepositoryToken(Offside),
          useValue: getRepositoryMock<Offside>(),
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

    controller = module.get<OffsideController>(OffsideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
