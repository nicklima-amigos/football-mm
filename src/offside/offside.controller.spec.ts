import { Test, TestingModule } from '@nestjs/testing';
import { OffsideController } from './offside.controller';
import { OffsideService } from './offside.service';

describe('OffsideController', () => {
  let controller: OffsideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffsideController],
      providers: [OffsideService],
    }).compile();

    controller = module.get<OffsideController>(OffsideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
