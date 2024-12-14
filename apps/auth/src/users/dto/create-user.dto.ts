import { IsEmail, IsStrongPassword } from 'class-validator';

/**
 * CreateUserDto is a Data Transfer Object (DTO) that defines the structure
 * and validation rules for creating a new user.
 */
export class CreateUserDto {
  /**
   * The email address of the user.
   * - Must be a valid email format.
   * @type {string}
   */
  @IsEmail()
  email: string;

  /**
   * The password for the user.
   * - Must meet strong password requirements (e.g., length, special characters, uppercase/lowercase letters, numbers).
   * @type {string}
   */
  @IsStrongPassword()
  password: string;
}
