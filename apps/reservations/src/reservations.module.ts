import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './reservations/models/reservation.schema';

/**
 * ReservationsModule is responsible for handling reservation-related functionality.
 * It connects the controller, service, and repository, and manages schema registration.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService, // Provides business logic for reservations
    ReservationsRepository, // Provides database access for reservation operations
  ],
})
export class ReservationsModule {}
