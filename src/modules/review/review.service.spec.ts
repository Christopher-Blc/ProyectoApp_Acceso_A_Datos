import { beforeEach, describe, expect, it } from '@jest/globals';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let instance: ReviewService;

  beforeEach(() => {
    instance = Object.create(ReviewService.prototype) as ReviewService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
