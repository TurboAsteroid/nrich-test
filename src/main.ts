import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './_config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, exposedHeaders: ['X-Access-Token'] });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (!Config.production) {
    const options = new DocumentBuilder()
      .setTitle('NRich-test')
      .setDescription('')
      .setVersion('0.0.1')
      .addBearerAuth()
      .addServer('http://')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('', app, document);
  }

  await app.listen(Config.apiPort);

  /** Logs */
  if (!Config.production) {
    logger.debug(`Swagger run: ${Config.appBaseUri}:${Config.apiPort}/docs`);
  }
  logger.debug(`Server started on port ${Config.appBaseUri}:${Config.apiPort}`);
}

bootstrap().catch((e) => new Logger().error(e));
