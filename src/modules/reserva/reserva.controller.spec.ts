import { ReservaController } from './reserva.controller';

describe('ReservaController', () => {
  let instance: ReservaController;

  beforeEach(() => {
    instance = Object.create(ReservaController.prototype) as ReservaController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
