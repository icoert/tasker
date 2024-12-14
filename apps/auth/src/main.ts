import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

/**
 * The `bootstrap` function initializes and starts the NestJS authentication service application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  /**
   * Connects a new microservice to the NestJS application.
   */
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });

  /**
   * Integrates the `cookie-parser` middleware into the application.
   * */
  app.use(cookieParser());

  /**
   * Use global pipes for validation.
   * - `ValidationPipe`: Automatically validates incoming requests against the defined DTOs.
   * - Options:
   *    - `whitelist: true`: Automatically strips properties that are not defined in the DTO, improving security.
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  /**
   * Integrates the Pino Logger into the application.
   * - Retrieves the logger instance from the application context and sets it as the global logger.
   * - Provides structured and high-performance logging for the application.
   */
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3001);
}
bootstrap();
