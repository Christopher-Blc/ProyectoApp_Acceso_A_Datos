import { beforeEach, describe, expect, it } from '@jest/globals';
import { ReviewController } from './review.controller';

describe('ReviewController', () => {
  let instance: ReviewController;

  beforeEach(() => {
    instance = Object.create(ReviewController.prototype) as ReviewController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

