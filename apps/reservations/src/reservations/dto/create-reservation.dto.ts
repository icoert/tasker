import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

/**
 * CreateReservationDto is a Data Transfer Object (DTO) that defines the structure
 * and validation rules for creating a reservation.
 */
export class CreateReservationDto {
  /**
   * The start date of the reservation.
   * - Must be a valid Date object.
   * - Automatically transformed into a Date using `class-transformer`.
   * @type {Date}
   */
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  /**
   * The end date of the reservation.
   * - Must be a valid Date object.
   * - Automatically transformed into a Date using `class-transformer`.
   * @type {Date}
   */
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  /**
   * The ID of the place being reserved.
   * - Must be a non-empty string.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  placeId: string;

  /**
   * The ID of the invoice associated with the reservation.
   * - Must be a non-empty string.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
