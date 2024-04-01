import * as process from 'process';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '~/src/app/app.module';
import * as packageConfig from '../package.json';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('JWT Auth API')
    .setDescription('Documentation for an API which provides authentication with jwt access token and refresh token')
    .setVersion(packageConfig.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs/json',
    yamlDocumentUrl: '/docs/yaml',
  });

  await app.listen(process.env.API_PORT || 3000);
}

void bootstrap();
