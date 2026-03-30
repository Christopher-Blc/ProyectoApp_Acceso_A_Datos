import { Test, TestingModule } from '@nestjs/testing';
import { PistaService } from './pista.service';

describe('PistaService', () => {
  let service: PistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PistaService],
    }).compile();

    service = module.get<PistaService>(PistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
