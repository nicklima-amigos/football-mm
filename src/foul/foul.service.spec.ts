import { Test, TestingModule } from '@nestjs/testing';
import { FoulService } from './foul.service';

describe('FoulService', () => {
  let service: FoulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoulService],
    }).compile();

    service = module.get<FoulService>(FoulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
