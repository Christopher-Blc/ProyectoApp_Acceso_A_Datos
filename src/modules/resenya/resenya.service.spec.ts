import { Test, TestingModule } from '@nestjs/testing';
import { ResenyaService } from './resenya.service';

describe('ResenyaService', () => {
  let service: ResenyaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResenyaService],
    }).compile();

    service = module.get<ResenyaService>(ResenyaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
