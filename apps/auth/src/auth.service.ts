import { Injectable } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

/**
 * AuthService handles the business logic for user authentication.
 * It manages token generation and response setup for authenticated users.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Handles user login by generating a JSON Web Token (JWT) and setting it in an HTTP-only cookie.
   * - The JWT contains a payload with the authenticated user's ID.
   * - The cookie is set with an expiration time derived from the `JWT_EXPIRATION` configuration.
   *
   * @param {UserDocument} user - The authenticated user's document.
   *   - `_id`: The unique identifier of the user, converted to a string for the token payload.
   * @param {Response} response - The HTTP response object used to set the cookie.
   *   - `response.cookie`: Sets the cookie with the JWT for client-side storage.
   */
  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      expires,
    });
  }
}
