import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

/**
 * `LocalStrategy` is a custom implementation of the Passport Local strategy.
 * - Handles user authentication based on email and password.
 * - Delegates user verification to the `UsersService`.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for LocalStrategy.
   * Configures the Passport Local strategy to use 'email' as the username field.
   * @param {UsersService} usersService - The service for user verification and business logic.
   */
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user's credentials.
   * - Invoked automatically by Passport during the authentication process.
   * - Delegates the actual verification to the `UsersService.verifyUser` method.
   * - Throws an `UnauthorizedException` if validation fails.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's plaintext password.
   * @returns {Promise<any>} The user object if validation succeeds.
   * @throws {UnauthorizedException} If the email or password is invalid.
   */
  async validate(email: string, password: string) {
    try {
      return await this.usersService.verifyUser(email, password);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
