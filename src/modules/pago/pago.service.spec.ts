import { PagoService } from './pago.service';

describe('PagoService', () => {
  let instance: PagoService;

  beforeEach(() => {
    instance = Object.create(PagoService.prototype) as PagoService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
