import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const httpLogger = new Logger('HTTP');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const rootPath = process.cwd();
  const publicPath = join(rootPath, 'public');

  // Logging específico para chats.html ANTES de servir assets
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/public/chats.html' || req.url.includes('chats.html')) {
      const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';
      const userAgent = req.get('user-agent') || 'Unknown';
      const timestamp = new Date().toISOString();
      httpLogger.log(`✉️  CHATS OPENED: [${timestamp}] IP=${ip} | UA=${userAgent}`);
    }
    next();
  });

  // Servir /public primero (más específico)
  app.useStaticAssets(publicPath, {
    prefix: '/public/',
    setHeaders: (res, path) => {
      if (path.endsWith('ResPi_dev1.0.2.apk')) {
        res.set('Content-Type', 'application/vnd.android.package-archive');
        res.set(
          'Content-Disposition',
          'attachment; filename="ResPi_dev1.0.2.apk"',
        );
      }
    },
  });

  // Luego /static (fallback genérico)
  app.useStaticAssets(join(rootPath, 'static'), {
    prefix: '/',
  });

  console.log(`Images available in: ${publicPath}`);

  // Logging global por request
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;

    res.on('finish', () => {
      const elapsedMs = Date.now() - startedAt;
      httpLogger.log(`${method} ${url} ${res.statusCode} - ${elapsedMs}ms`);
    });

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Respi API')
    .setDescription('API Documentation Respi Backend')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .addServer('https://respi.es/api', 'Servidor de Producción/VPS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`-> App ready at: ${process.env.APP_URL}`);
}

void bootstrap();
