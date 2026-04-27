import { ResenyaService } from './resenya.service';

describe('ResenyaService', () => {
  let instance: ResenyaService;

  beforeEach(() => {
    instance = Object.create(ResenyaService.prototype) as ResenyaService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
