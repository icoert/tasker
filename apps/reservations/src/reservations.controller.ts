import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';

/**
 * The ReservationsController handles incoming HTTP requests related to reservations
 * and delegates the processing to the ReservationsService.
 */
@Controller('reservations')
export class ReservationsController {
  /**
   * Constructor for ReservationsController.
   * Injects the ReservationsService to handle business logic for reservation operations.
   * @param {ReservationsService} reservationsService - The service to handle reservation logic.
   */
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Handles the creation of a new reservation.
   * - Secures the route using the `JwtAuthGuard`, ensuring only authenticated users can access it.
   * - Uses the `@CurrentUser` decorator to retrieve the details of the authenticated user.
   * - Passes the reservation details to the `ReservationsService` for processing and saving.
   *
   * @param {CreateReservationDto} createReservationDto - The Data Transfer Object containing the reservation details:
   *   - `startDate`: The start date of the reservation.
   *   - `endDate`: The end date of the reservation.
   * @param {UserDto} user - The authenticated user's details, extracted via the `@CurrentUser` decorator:
   *   - `userId`: The unique identifier of the authenticated user.
   * @returns {Promise<any>} A promise that resolves to the created reservation.
   *   - Includes the details of the reservation stored in the database.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    const _user = await this.reservationsService.create(
      createReservationDto,
      user,
    );

    return _user;
  }

  /**
   * Retrieves all reservations.
   * @returns {Promise<any[]>} An array of reservations.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  /**
   * Retrieves a single reservation by its ID.
   * @param {string} id - The ID of the reservation to retrieve.
   * @returns {Promise<any>} The reservation details.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  /**
   * Updates an existing reservation.
   * @param {string} id - The ID of the reservation to update.
   * @param {UpdateReservationDto} updateReservationDto - The data transfer object containing updated details.
   * @returns {Promise<any>} The updated reservation.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  /**
   * Deletes a reservation by its ID.
   * @param {string} id - The ID of the reservation to delete.
   * @returns {Promise<any>} A confirmation of the deletion.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
