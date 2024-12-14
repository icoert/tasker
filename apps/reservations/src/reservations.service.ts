import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

/**
 * ReservationsService provides business logic for handling reservations.
 * It interacts with the ReservationsRepository to perform database operations.
 */
@Injectable()
export class ReservationsService {
  /**
   * Constructor for ReservationsService.
   * Injects the ReservationsRepository for handling database operations.
   * @param {ReservationsRepository} reservationsRepository - The repository for reservations.
   */
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  /**
   * Creates a new reservation.
   * Adds a timestamp and a hardcoded user ID to the data before saving.
   * @param {CreateReservationDto} createReservationDto - The data for the new reservation.
   * @returns {Promise<any>} The created reservation.
   */
  create(createReservationDto: CreateReservationDto, userId: string) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
  }

  /**
   * Retrieves all reservations.
   * @returns {Promise<any[]>} An array of reservations.
   */
  findAll() {
    return this, this.reservationsRepository.find({});
  }

  /**
   * Retrieves a single reservation by its ID.
   * @param {string} _id - The ID of the reservation to retrieve.
   * @returns {Promise<any>} The reservation details.
   */
  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  /**
   * Updates an existing reservation by its ID.
   * @param {string} _id - The ID of the reservation to update.
   * @param {UpdateReservationDto} updateReservationDto - The updated reservation details.
   * @returns {Promise<any>} The updated reservation.
   */
  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  /**
   * Deletes a reservation by its ID.
   * @param {string} _id - The ID of the reservation to delete.
   * @returns {Promise<any>} A confirmation of the deletion.
   */
  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
