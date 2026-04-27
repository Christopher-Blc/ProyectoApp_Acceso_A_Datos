import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let instance: ReservaService;

  beforeEach(() => {
    instance = Object.create(ReservaService.prototype) as ReservaService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
