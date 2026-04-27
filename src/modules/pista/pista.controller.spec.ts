import { PistaController } from './pista.controller';

describe('PistaController', () => {
  let instance: PistaController;

  beforeEach(() => {
    instance = Object.create(PistaController.prototype) as PistaController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
