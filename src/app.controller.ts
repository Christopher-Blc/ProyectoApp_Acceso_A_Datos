import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getLandingPage();
  }
}

// Comandos para iniciar el programa:
// docker compose up -d
// nest start run:dev
