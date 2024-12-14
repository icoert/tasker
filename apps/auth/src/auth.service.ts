import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
   * Handles user login by generating a JWT and setting it in an HTTP-only cookie.
   *
   * @param user - The authenticated user's document.
   * @param response - The HTTP response object for setting the cookie.
   */
  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
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
