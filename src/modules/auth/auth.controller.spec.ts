import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let instance: AuthController;

  beforeEach(() => {
    instance = Object.create(AuthController.prototype) as AuthController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
