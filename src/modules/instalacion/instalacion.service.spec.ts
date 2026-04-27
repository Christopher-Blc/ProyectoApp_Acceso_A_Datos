import { Test, TestingModule } from '@nestjs/testing';
import { InstalacionService } from './instalacion.service';

describe('InstalacionService', () => {
  let service: InstalacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstalacionService],
    }).compile();

    service = module.get<InstalacionService>(InstalacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
