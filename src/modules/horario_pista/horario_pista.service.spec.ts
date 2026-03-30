import { Test, TestingModule } from '@nestjs/testing';
import { HorarioPistaService } from './horario_pista.service';

describe('HorarioPistaService', () => {
  let service: HorarioPistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorarioPistaService],
    }).compile();

    service = module.get<HorarioPistaService>(HorarioPistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
