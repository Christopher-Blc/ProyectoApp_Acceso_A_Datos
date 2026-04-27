import { MembresiaService } from './membresia.service';

describe('MembresiaService', () => {
  let instance: MembresiaService;

  beforeEach(() => {
    instance = Object.create(MembresiaService.prototype) as MembresiaService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
