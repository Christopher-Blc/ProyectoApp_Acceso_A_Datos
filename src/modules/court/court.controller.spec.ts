import { beforeEach, describe, expect, it } from '@jest/globals';
import { CourtController } from './court.controller';

describe('CourtController', () => {
  let instance: CourtController;

  beforeEach(() => {
    instance = Object.create(CourtController.prototype) as CourtController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

