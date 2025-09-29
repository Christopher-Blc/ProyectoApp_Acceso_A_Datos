import { Test, TestingModule } from '@nestjs/testing';
import { HorarioPistaController } from './horario_pista.controller';

describe('HorarioPistaController', () => {
  let controller: HorarioPistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorarioPistaController],
    }).compile();

    controller = module.get<HorarioPistaController>(HorarioPistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
