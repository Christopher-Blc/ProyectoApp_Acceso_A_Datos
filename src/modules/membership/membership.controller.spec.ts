import { beforeEach, describe, expect, it } from '@jest/globals';
import { MembershipController } from './membership.controller';

describe('MembershipController', () => {
  let instance: MembershipController;

  beforeEach(() => {
    instance = Object.create(
      MembershipController.prototype,
    ) as MembershipController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

