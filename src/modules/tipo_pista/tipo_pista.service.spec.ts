import { TipoPistaService } from './tipo_pista.service';

describe('TipoPistaService', () => {
  let instance: TipoPistaService;

  beforeEach(() => {
    instance = Object.create(TipoPistaService.prototype) as TipoPistaService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
