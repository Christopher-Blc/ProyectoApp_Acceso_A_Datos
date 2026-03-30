import { Test, TestingModule } from '@nestjs/testing';
import { PagoController } from './pago.controller';

describe('PagoController', () => {
  let controller: PagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagoController],
    }).compile();

    controller = module.get<PagoController>(PagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
