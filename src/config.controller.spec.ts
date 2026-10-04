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
});
