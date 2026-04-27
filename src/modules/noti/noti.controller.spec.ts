import { NotiController } from './noti.controller';

describe('NotiController', () => {
  let instance: NotiController;

  beforeEach(() => {
    instance = Object.create(NotiController.prototype) as NotiController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
