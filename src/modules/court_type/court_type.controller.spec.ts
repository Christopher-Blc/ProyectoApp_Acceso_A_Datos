import { beforeEach, describe, expect, it } from '@jest/globals';
import { CourtTypeController } from './court_type.controller';

describe('CourtTypeController', () => {
  let instance: CourtTypeController;

  beforeEach(() => {
    instance = Object.create(
      CourtTypeController.prototype,
    ) as CourtTypeController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
