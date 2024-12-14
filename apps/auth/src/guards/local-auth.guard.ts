import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard
 * Extends the NestJS AuthGuard and uses the 'local' strategy for authentication.
 *
 * This guard ensures that only requests with valid credentials processed
 * by the 'local' strategy are allowed to proceed.
 */
export class LocalAuthGuard extends AuthGuard('local') {}
