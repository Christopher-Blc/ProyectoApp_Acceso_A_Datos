import { beforeEach, describe, expect, it } from '@jest/globals';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let instance: PaymentService;

  beforeEach(() => {
    instance = Object.create(PaymentService.prototype) as PaymentService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

