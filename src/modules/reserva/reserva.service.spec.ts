import { Test, TestingModule } from '@nestjs/testing';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let service: ReservaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservaService],
    }).compile();

    service = module.get<ReservaService>(ReservaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
