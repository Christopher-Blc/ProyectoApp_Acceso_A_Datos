import { TipoPistaController } from './tipo_pista.controller';

describe('TipoPistaController', () => {
  let instance: TipoPistaController;

  beforeEach(() => {
    instance = Object.create(
      TipoPistaController.prototype,
    ) as TipoPistaController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
