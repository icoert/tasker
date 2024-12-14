import { IsNotEmpty, IsString } from 'class-validator';

/**
 * GetUserDto is a Data Transfer Object (DTO) that defines the structure
 * and validation rules for retrieving a user by their unique identifier.
 */
export class GetUserDto {
  /**
   * The unique identifier of the user to be retrieved.
   * - Must be a non-empty string.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  _id: string;
}
