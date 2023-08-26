import { Test, TestingModule } from '@nestjs/testing';
import { OffsideService } from './offside.service';

describe('OffsideService', () => {
  let service: OffsideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffsideService],
    }).compile();

    service = module.get<OffsideService>(OffsideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
