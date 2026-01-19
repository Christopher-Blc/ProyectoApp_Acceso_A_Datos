import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  //para que la app valide los dtos y de los mensajes de error que tocan 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // borra campos que no están en el DTO
      forbidNonWhitelisted: true, // si mandan campos extra, 400
      transform: true,            // transforma tipos si usas class-transformer
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  app.enableCors({
    //en produccion no se pondria * para restringir el acceso a las apis
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
}
bootstrap();