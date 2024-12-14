import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';
import { map, Observable, tap } from 'rxjs';
import { UserDto } from '../dto';

/**
 * JwtAuthGuard is a custom guard for securing routes using JWT authentication.
 * - Verifies the JWT by delegating the authentication process to a remote `AUTH_SERVICE`.
 * - Adds the authenticated user's details to the request object if the JWT is valid.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * Constructor for JwtAuthGuard.
   * - Injects the `ClientProxy` for communicating with the remote `AUTH_SERVICE`.
   *
   * @param {ClientProxy} authClient - The microservice client proxy for the authentication service.
   */
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  /**
   * Determines whether a request is allowed to proceed based on JWT validation.
   * - Extracts the JWT from the `Authentication` cookie.
   * - Sends the JWT to the `AUTH_SERVICE` for validation via a microservice communication pattern.
   * - Adds the validated user's details to the request object if the token is valid.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   *
   * @returns {boolean | Promise<boolean> | Observable<boolean>} A boolean or an observable/promise that resolves to `true` if the request is authenticated.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        // On successful validation, attach the authenticated user's details to the request
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        // Map the response to `true` if the JWT is valid
        map(() => true),
      );
  }
}
