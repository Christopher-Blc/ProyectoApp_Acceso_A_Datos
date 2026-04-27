import { NotiService } from './noti.service';

describe('NotiService', () => {
  let instance: NotiService;

  beforeEach(() => {
    instance = Object.create(NotiService.prototype) as NotiService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
