import { afterEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ConfigController } from './config.controller';

describe('ConfigController', () => {
  const tempFilePath = path.join(os.tmpdir(), 'config-controller-test.json');

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('returns default config when config file contains invalid JSON', () => {
    fs.writeFileSync(tempFilePath, '{invalid-json}', 'utf8');

    const controller = new ConfigController();
    (controller as { filePath: string }).filePath = tempFilePath;

    expect(controller.getConfig()).toEqual({ fechaInicio: '2026-09-15T12:00' });
  });

  it('adds no-cache headers to config responses', () => {
    const controller = new ConfigController();
    const res = { set: jest.fn() } as any;
    const expectedConfig = { fechaInicio: '2026-09-15T12:00' };

    fs.writeFileSync(tempFilePath, JSON.stringify(expectedConfig), 'utf8');
    (controller as { filePath: string }).filePath = tempFilePath;

    const result = controller.getConfig(res);

    expect(result).toEqual(expectedConfig);
    expect(res.set).toHaveBeenCalledWith(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    expect(res.set).toHaveBeenCalledWith('Pragma', 'no-cache');
    expect(res.set).toHaveBeenCalledWith('Expires', '0');
  });
});
