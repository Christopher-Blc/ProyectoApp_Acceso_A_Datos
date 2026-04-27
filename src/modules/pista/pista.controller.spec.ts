import { Test, TestingModule } from '@nestjs/testing';
import { PistaController } from './pista.controller';

describe('PistaController', () => {
  let controller: PistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PistaController],
    }).compile();

    controller = module.get<PistaController>(PistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
