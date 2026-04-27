import { MembresiaController } from './membresia.controller';

describe('MembresiaController', () => {
  let instance: MembresiaController;

  beforeEach(() => {
    instance = Object.create(
      MembresiaController.prototype,
    ) as MembresiaController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
