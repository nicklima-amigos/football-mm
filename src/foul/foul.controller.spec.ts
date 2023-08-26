import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepositoryMock } from '../../test/mocks/repository';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Foul } from './entities/foul.entity';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';
import { Repository } from 'typeorm';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

describe('FoulController', () => {
  let controller: FoulController;
  let foulRepository: Repository<Foul>;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  let app: NestApplication;

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
    foulRepository = module.get<Repository<Foul>>(getRepositoryToken(Foul));
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
