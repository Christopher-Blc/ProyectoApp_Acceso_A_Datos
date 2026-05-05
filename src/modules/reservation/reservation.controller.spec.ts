import { beforeEach, describe, expect, it } from '@jest/globals';
import { ReservationController } from './reservation.controller';

describe('ReservationController', () => {
  let instance: ReservationController;

  beforeEach(() => {
    instance = Object.create(ReservationController.prototype) as ReservationController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});




