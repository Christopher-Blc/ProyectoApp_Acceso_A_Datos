import { Test, TestingModule } from '@nestjs/testing';
import { ComentarioService } from './comentario.service';

describe('ComentarioService', () => {
  let service: ComentarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComentarioService],
    }).compile();

    service = module.get<ComentarioService>(ComentarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
