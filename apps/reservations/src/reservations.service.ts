import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, mergeMap, timestamp } from 'rxjs';

/**
 * Constructor for ReservationsService.
 * - Injects the `ReservationsRepository` for managing database operations related to reservations.
 * - Injects the `paymentsService` microservice client for communicating with the Payments Service.
 *
 * @param {ReservationsRepository} reservationsRepository - The repository responsible for handling reservation-related database operations.
 * @param {ClientProxy} paymentsService - The microservice client proxy for communicating with the Payments Service.
 *   - Enables interaction with the Payments Service for handling payment-related tasks associated with reservations.
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
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  /**
   * Handles the creation of a new reservation and processes the associated payment.
   * - Sends a charge request to the Payments Service with the reservation's charge details and the user's email.
   * - On successful payment, saves the reservation data to the database.
   *
   * @param {CreateReservationDto} createReservationDto - The Data Transfer Object containing reservation details:
   *   - `startDate`: The start date of the reservation.
   *   - `endDate`: The end date of the reservation.
   *   - `placeId`: The ID of the place being reserved.
   *   - `charge`: The charge details required for payment processing (e.g., card details, amount).
   * @param {UserDto} user - The authenticated user's details, including:
   *   - `email`: The user's email address.
   *   - `_id`: The unique identifier of the user, used as `userId` in the reservation.
   *
   * @returns {Observable<any>} An observable that resolves to the created reservation.
   *   - Includes reservation details such as start date, end date, place ID, invoice ID, timestamp, and user ID.
   *
   * @throws {Error} If the payment fails, the reservation is not created.
   */
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    return this.paymentsService
      .send('create_charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  /**
   * Retrieves all reservations.
   * @returns {Promise<any[]>} An array of reservations.
   */
  async findAll() {
    return this, this.reservationsRepository.find({});
  }

  /**
   * Retrieves a single reservation by its ID.
   * @param {string} _id - The ID of the reservation to retrieve.
   * @returns {Promise<any>} The reservation details.
   */
  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  /**
   * Updates an existing reservation by its ID.
   * @param {string} _id - The ID of the reservation to update.
   * @param {UpdateReservationDto} updateReservationDto - The updated reservation details.
   * @returns {Promise<any>} The updated reservation.
   */
  async update(_id: string, updateReservationDto: UpdateReservationDto) {
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
  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
