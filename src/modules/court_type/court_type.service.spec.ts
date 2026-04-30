import { CourtTypeService } from './tipo_court.service';

describe('CourtTypeService', () => {
  let instance: CourtTypeService;

  beforeEach(() => {
    instance = Object.create(CourtTypeService.prototype) as CourtTypeService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

