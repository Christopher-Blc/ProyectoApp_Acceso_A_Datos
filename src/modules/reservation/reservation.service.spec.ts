import { ReservationService } from './reservationtiontion.service';

describe('ReservationService', () => {
  let instance: ReservationService;

  beforeEach(() => {
    instance = Object.create(ReservationService.prototype) as ReservationService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});



