import { Test, TestingModule } from '@nestjs/testing';
import { FoulController } from './foul.controller';
import { FoulService } from './foul.service';

describe('FoulController', () => {
  let controller: FoulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoulController],
      providers: [FoulService],
    }).compile();

    controller = module.get<FoulController>(FoulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
