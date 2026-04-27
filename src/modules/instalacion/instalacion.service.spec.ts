import { InstalacionService } from './instalacion.service';

describe('InstalacionService', () => {
  let instance: InstalacionService;

  beforeEach(() => {
    instance = Object.create(
      InstalacionService.prototype,
    ) as InstalacionService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
