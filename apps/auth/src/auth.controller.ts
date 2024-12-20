import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * AuthController is responsible for handling authentication-related routes.
 * It includes endpoints for user login and leverages guards and decorators
 * for streamlined authentication workflows.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /login
   * Secured route for user login.
   *
   * @UseGuards(LocalAuthGuard) - Ensures the user is authenticated using the LocalAuthGuard.
   * @param user - Injects the authenticated user's data using the CurrentUser decorator.
   * @param response - The HTTP response object, passed with passthrough enabled.
   * @returns Sends the authenticated user's data as the response.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);

    response.send(user);
  }

  /**
   * Handles the 'authenticate' message pattern for microservice communication.
   * - Secures the route using the `JwtAuthGuard` to ensure only authenticated requests are processed.
   * - Extracts and returns the authenticated user's details from the payload.
   *
   * @param {any} data - The payload of the incoming message.
   *   - `data.user`: Contains the details of the authenticated user.
   *
   * @returns {Promise<any>} A promise resolving to the authenticated user's details.
   */
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
