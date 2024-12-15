import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './reservations/models/reservation.schema';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/services';
import { ClientsModule, Transport } from '@nestjs/microservices';

/**
 * ReservationsModule is responsible for handling reservation-related functionality.
 * It integrates database access, logging, and business logic into a single module.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    /**
     * Configuration for the `ConfigModule`.
     * - Makes the configuration globally accessible throughout the application.
     * - Validates environment variables using Joi.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    /**
     * Registers a microservice client in the application.
     * - Configures the client to communicate with the `AUTH_SERVICE` using the TCP transport protocol.
     *
     * @param {string} name - The unique identifier for the microservice client.
     *   - `AUTH_SERVICE`: Refers to the authentication service, defined as a constant.
     * @param {Transport} transport - Specifies the transport protocol for communication.
     *   - `Transport.TCP`: Uses TCP as the transport layer, providing reliable, connection-oriented communication.
     *
     * Usage:
     * - This configuration allows the application to act as a client for the authentication microservice.
     * - Enables sending messages and receiving responses from the `AUTH_SERVICE`.
     */
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController], // Defines the controller for handling reservation-related routes
  providers: [
    ReservationsService, // Provides business logic for reservations
    ReservationsRepository, // Provides database access for reservation operations
  ],
})
export class ReservationsModule {}
