import { Test, TestingModule } from '@nestjs/testing';
import { MembresiaService } from './membresia.service';

describe('MembresiaService', () => {
  let service: MembresiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembresiaService],
    }).compile();

    service = module.get<MembresiaService>(MembresiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
