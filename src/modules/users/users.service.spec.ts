import { UsersService } from './users.service';

describe('UsersService', () => {
  let instance: UsersService;

  beforeEach(() => {
    instance = Object.create(UsersService.prototype) as UsersService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
