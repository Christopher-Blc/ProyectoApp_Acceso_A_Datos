import { PagoController } from './pago.controller';

describe('PagoController', () => {
  let instance: PagoController;

  beforeEach(() => {
    instance = Object.create(PagoController.prototype) as PagoController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
