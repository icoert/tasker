import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';

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
   * Represents the charge details required for payment processing.
   * - The property is required and validated to ensure it is a non-empty object with a valid structure.
   * - Must conform to the structure defined in the `CreateChargeDto` class.
   *
   * Decorators:
   * - `@IsDefined()`: Ensures that the property is defined in the input object.
   * - `@IsNotEmptyObject()`: Ensures that the property is not an empty object (e.g., `{}`).
   * - `@ValidateNested()`: Validates the nested structure of the `charge` property based on the `CreateChargeDto` class.
   * - `@Type(() => CreateChargeDto)`: Validates the nested structure of the `charge` property based on the `CreateChargeDto` class.
   *
   * @type {CreateChargeDto}
   */
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
