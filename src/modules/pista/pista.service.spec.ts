import { PistaService } from './pista.service';

describe('PistaService', () => {
  let instance: PistaService;

  beforeEach(() => {
    instance = Object.create(PistaService.prototype) as PistaService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
