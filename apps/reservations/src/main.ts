import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

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

  /**
   * Start the application and listen on the specified port.
   * - `process.env.port`: Retrieves the port from environment variables.
   * - Defaults to `3000` if no port is specified.
   */
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
