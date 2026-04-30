import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path/posix';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const rootPath = process.cwd();
  const publicPath = join(rootPath, 'public');

  app.useStaticAssets(publicPath, {
    prefix: '/public/',
  });

  console.log(`🚀 Docker routes loaded`);
  console.log(`📂 Looking for images in: ${publicPath}`);

  // So that the app validates DTOs and returns the appropriate error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes fields that are not in the DTO
      forbidNonWhitelisted: true, // if extra fields are sent, 400
      transform: true, // transforms types if using class-transformer
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    // in production, * would not be used to restrict access to APIs
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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`✅ App ready at: ${process.env.APP_URL}`);
}

void bootstrap();
