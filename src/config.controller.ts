import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function applyNoCacheHeaders(res?: Response) {
  if (!res) return;
  Object.entries(NO_CACHE_HEADERS).forEach(([key, value]) => {
    res.set(key, value);
  });
}

@Controller(['api/config', 'config'])
export class ConfigController {
  private filePath = path.resolve(process.cwd(), 'config.json');

  @Get()
  getConfig(@Res({ passthrough: true }) res?: Response) {
    applyNoCacheHeaders(res);

    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
      }
    } catch {
      return { fechaInicio: '2026-09-15T12:00' };
    }
    return { fechaInicio: '2026-09-15T12:00' };
  }

  @Post()
  saveConfig(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) res?: Response,
  ) {
    applyNoCacheHeaders(res);

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(body, null, 2), 'utf8');
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
