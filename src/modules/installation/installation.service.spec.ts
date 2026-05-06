import { beforeEach, describe, expect, it } from '@jest/globals';
import { InstallationService } from './installation.service';

describe('InstallationService', () => {
  let instance: InstallationService;

  beforeEach(() => {
    instance = Object.create(
      InstallationService.prototype,
    ) as InstallationService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
