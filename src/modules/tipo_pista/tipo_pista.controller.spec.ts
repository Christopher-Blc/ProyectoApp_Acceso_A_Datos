import { Test, TestingModule } from '@nestjs/testing';
import { TipoPistaController } from './tipo_pista.controller';

describe('TipoPistaController', () => {
  let controller: TipoPistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoPistaController],
    }).compile();

    controller = module.get<TipoPistaController>(TipoPistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
