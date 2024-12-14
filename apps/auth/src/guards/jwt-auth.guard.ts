import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard is a custom authentication guard that extends the NestJS Passport `AuthGuard` class.
 * - Implements JWT-based authentication.
 * - Protects routes by verifying the presence and validity of a JSON Web Token (JWT) in the request.
 * - Uses the 'jwt' strategy defined in the application to validate the token.
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}
