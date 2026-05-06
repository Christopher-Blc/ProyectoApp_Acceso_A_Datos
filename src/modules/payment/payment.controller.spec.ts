import { beforeEach, describe, expect, it } from '@jest/globals';
import { PaymentController } from './payment.controller';

describe('PaymentController', () => {
  let instance: PaymentController;

  beforeEach(() => {
    instance = Object.create(PaymentController.prototype) as PaymentController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
