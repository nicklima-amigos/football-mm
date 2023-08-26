import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Offside } from './entities/offside.entity';
import { OffsideController } from './offside.controller';
import { OffsideService } from './offside.service';
import { Repository } from 'typeorm';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

describe('OffsideController', () => {
  let controller: OffsideController;
  let offsideRepository: Repository<Offside>;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

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
    offsideRepository = module.get<Repository<Offside>>(
      getRepositoryToken(Offside),
    );
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
