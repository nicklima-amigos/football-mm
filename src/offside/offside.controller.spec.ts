import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Player } from '../players/entities/player.entity';
import { Offside } from './entities/offside.entity';
import { OffsideController } from './offside.controller';
import { OffsideService } from './offside.service';
import { Repository } from 'typeorm';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { BaseGame } from '../base-game/entities/base-game.entity';

describe('OffsideController', () => {
  let controller: OffsideController;
  let offsideRepository: Repository<Offside>;
  let gameRepository: Repository<BaseGame>;
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
          provide: getRepositoryToken(BaseGame),
          useValue: getRepositoryMock<BaseGame>(),
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
    gameRepository = module.get<Repository<BaseGame>>(
      getRepositoryToken(BaseGame),
    );
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
