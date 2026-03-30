import { Test, TestingModule } from '@nestjs/testing';
import { MembresiaController } from './membresia.controller';

describe('MembresiaController', () => {
  let controller: MembresiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembresiaController],
    }).compile();

    controller = module.get<MembresiaController>(MembresiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
