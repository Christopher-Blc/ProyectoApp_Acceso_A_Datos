import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let instance: NotificationService;

  beforeEach(() => {
    instance = Object.create(NotificationService.prototype) as NotificationService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});

