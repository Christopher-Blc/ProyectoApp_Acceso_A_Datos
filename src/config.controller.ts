import { Controller, Get, Post, Body } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller(['api/config', 'config'])
export class ConfigController {
  private filePath = path.resolve(process.cwd(), 'config.json');

  @Get()
  getConfig() {
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
  saveConfig(@Body() body: Record<string, unknown>) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(body, null, 2), 'utf8');
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
