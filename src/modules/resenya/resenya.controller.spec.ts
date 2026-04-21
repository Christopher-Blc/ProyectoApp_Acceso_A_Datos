import { Test, TestingModule } from '@nestjs/testing';
import { ResenyaController } from './resenya.controller';

describe('ResenyaController', () => {
  let controller: ResenyaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResenyaController],
    }).compile();

    controller = module.get<ResenyaController>(ResenyaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});






