import { Test, TestingModule } from '@nestjs/testing';
import { TipoPistaService } from './tipo_pista.service';

describe('TipoPistaService', () => {
  let service: TipoPistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoPistaService],
    }).compile();

    service = module.get<TipoPistaService>(TipoPistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
