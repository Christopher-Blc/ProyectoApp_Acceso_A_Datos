import { beforeEach, describe, expect, it } from '@jest/globals';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let instance: NotificationService;

  beforeEach(() => {
    instance = Object.create(
      NotificationService.prototype,
    ) as NotificationService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });

  it('buildExpoPreviewBody recorta mensajes largos y agrega puntos suspensivos', () => {
    const longMessage = 'a'.repeat(120);
    const preview = (instance as any).buildExpoPreviewBody(longMessage);

    expect(preview.endsWith('...')).toBe(true);
    expect(preview.length).toBe(93);
  });

  it('buildExpoPreviewBody no modifica mensajes cortos', () => {
    const shortMessage = 'mensaje corto';
    const preview = (instance as any).buildExpoPreviewBody(shortMessage);

    expect(preview).toBe(shortMessage);
  });
});
