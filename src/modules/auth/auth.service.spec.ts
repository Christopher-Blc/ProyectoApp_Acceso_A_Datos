import { beforeEach, describe, expect, it } from '@jest/globals';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let instance: AuthService;

  beforeEach(() => {
    instance = Object.create(AuthService.prototype) as AuthService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
