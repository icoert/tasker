import { AbstractRepository } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationDocument } from './reservations/models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * The ReservationsRepository is a data access layer for managing reservation records in the database.
 * It extends the AbstractRepository to leverage shared repository logic and functionality.
 */
@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  /**
   * Logger instance scoped to the ReservationsRepository class.
   * Provides logging functionality for the repository operations.
   * @protected
   * @readonly
   */
  protected readonly logger = new Logger(ReservationsRepository.name);

  /**
   * Constructor for the ReservationsRepository.
   * @param {Model<ReservationDocument>} reservationModel - The Mongoose model for ReservationDocument.
   */
  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }
}
