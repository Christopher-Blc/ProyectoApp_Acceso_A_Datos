import { beforeEach, describe, expect, it } from '@jest/globals';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let instance: UsersController;

  beforeEach(() => {
    instance = Object.create(UsersController.prototype) as UsersController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
