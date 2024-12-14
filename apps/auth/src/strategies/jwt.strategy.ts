import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

/**
 * JwtStrategy is a custom Passport strategy for handling JWT-based authentication.
 * - Extracts and validates the JSON Web Token (JWT) from incoming requests.
 * - Retrieves the authenticated user's details based on the token payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for JwtStrategy.
   * - Configures the JWT strategy with a secret key and a custom token extraction method.
   *
   * @param {ConfigService} configService - Provides access to environment variables and configuration values.
   * @param {UsersService} usersService - Service for user-related operations, such as fetching user details.
   */
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      /**
       * `jwtFromRequest`:
       * - Custom extractor to retrieve the JWT from the `Authentication` cookie in the request.
       */
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
      ]),
      /**
       * `secretOrKey`:
       * - The secret key used to validate the JWT signature.
       * - Retrieved from the `JWT_SECRET` environment variable via `ConfigService`.
       */
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the associated user.
   * - Called automatically by Passport after the token is successfully verified.
   *
   * @param {TokenPayload} payload - The payload of the verified JWT.
   *   - `userId`: The unique identifier of the authenticated user.
   *
   * @returns {Promise<UserDocument>} The authenticated user's details fetched from the database.
   */
  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
