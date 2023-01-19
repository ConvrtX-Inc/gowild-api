import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { validationOptions } from './common/validation-options';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.set('trust proxy', 1); // trust first proxy

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const options = new DocumentBuilder()
    .setTitle('Go wild API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('app.port');
  await app.listen(port, () => {
    Logger.log('------');
    console.log();
    console.log(`App running at     http://localhost:${port}`);
    console.log(`Docs at            http://localhost:${port}/docs`);
    console.log(`OpenApi Doc at     http://localhost:${port}/docs-json`);
    console.log(`Health at          http://localhost:${port}/api/health`);
    console.log();
    Logger.log('------');
  });
}

void bootstrap();
