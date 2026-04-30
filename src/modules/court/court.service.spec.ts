import { CourtService } from './court.service';

describe('CourtService', () => {
  let instance: CourtService;

  beforeEach(() => {
    instance = Object.create(CourtService.prototype) as CourtService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

