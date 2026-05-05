import { beforeEach, describe, expect, it } from '@jest/globals';
import { MembershipService } from './membership.service';

describe('MembershipService', () => {
  let instance: MembershipService;

  beforeEach(() => {
    instance = Object.create(MembershipService.prototype) as MembershipService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

