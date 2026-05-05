import { beforeEach, describe, expect, it } from '@jest/globals';
import { NotificationController } from './notification.controller';

describe('NotificationController', () => {
  let instance: NotificationController;

  beforeEach(() => {
    instance = Object.create(NotificationController.prototype) as NotificationController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

