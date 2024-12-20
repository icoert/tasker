import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

/**
 * The `bootstrap` function initializes and starts the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

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

  app.use(cookieParser());

  /**
   * Starts the application and listens on the specified port.
   * - Retrieves the port from the configuration service (`ConfigService`), which manages environment variables.
   * - Fallback: Defaults to port `3000` if no port is defined in the environment variables.
   */
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
