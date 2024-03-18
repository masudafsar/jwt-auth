import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('JWT Auth API')
    .setDescription(
      'Documentation for an API which provides authentication with jwt access token and refresh token',
    )
    .setVersion(packageConfig.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_PORT || 3000);
}

bootstrap();
