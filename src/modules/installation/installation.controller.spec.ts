import { InstallationController } from './installation.controller';

describe('InstallationController', () => {
  let instance: InstallationController;

  beforeEach(() => {
    instance = Object.create(
      InstallationController.prototype,
    ) as InstallationController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

