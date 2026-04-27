import { InstalacionController } from './instalacion.controller';

describe('InstalacionController', () => {
  let instance: InstalacionController;

  beforeEach(() => {
    instance = Object.create(
      InstalacionController.prototype,
    ) as InstalacionController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
