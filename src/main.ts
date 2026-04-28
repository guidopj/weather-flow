import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

// sin estos DNS la conexión con mongo atlas no me funciona
import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);   // ← Force reliable DNS (Cloudflare + Google)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  app.enableCors();

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
