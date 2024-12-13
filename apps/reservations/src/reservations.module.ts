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
  ],
  controllers: [ReservationsController], // Defines the controller for handling reservation-related routes
  providers: [
    ReservationsService, // Provides business logic for reservations
    ReservationsRepository, // Provides database access for reservation operations
  ],
})
export class ReservationsModule {}
