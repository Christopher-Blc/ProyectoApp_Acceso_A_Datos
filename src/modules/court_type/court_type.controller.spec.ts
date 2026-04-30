import { TipoCourtController } from './tipo_court.controller';

describe('TipoCourtController', () => {
  let instance: TipoCourtController;

  beforeEach(() => {
    instance = Object.create(
      TipoCourtController.prototype,
    ) as TipoCourtController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

