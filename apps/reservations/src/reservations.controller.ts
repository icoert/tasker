import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from './reservations/dto/update-reservation.dto';

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
   * @param {CreateReservationDto} createReservationDto - The data transfer object containing reservation details.
   * @returns {Promise<any>} The created reservation.
   */
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  /**
   * Retrieves all reservations.
   * @returns {Promise<any[]>} An array of reservations.
   */
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  /**
   * Retrieves a single reservation by its ID.
   * @param {string} id - The ID of the reservation to retrieve.
   * @returns {Promise<any>} The reservation details.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  /**
   * Updates an existing reservation.
   * @param {string} id - The ID of the reservation to update.
   * @param {UpdateReservationDto} updateReservationDto - The data transfer object containing updated details.
   * @returns {Promise<any>} The updated reservation.
   */
  @Patch(':id')
  update(
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
