import { ResenyaController } from './resenya.controller';

describe('ResenyaController', () => {
  let instance: ResenyaController;

  beforeEach(() => {
    instance = Object.create(ResenyaController.prototype) as ResenyaController;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
