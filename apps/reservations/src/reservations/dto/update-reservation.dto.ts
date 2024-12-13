import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

/**
 * UpdateReservationDto is a data transfer object used to update reservations.
 * It extends CreateReservationDto but makes all fields optional using PartialType.
 */
export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
