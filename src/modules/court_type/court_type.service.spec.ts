import { beforeEach, describe, expect, it } from '@jest/globals';
import { CourtTypeService } from './court_type.service';

describe('CourtTypeService', () => {
  let instance: CourtTypeService;

  beforeEach(() => {
    instance = Object.create(CourtTypeService.prototype) as CourtTypeService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
