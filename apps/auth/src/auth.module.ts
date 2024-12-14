import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';

/**
 * The AuthModule handles all functionality related to user authentication.
 * It integrates JWT authentication, user management, logging, and configuration.
 */
@Module({
  imports: [
    /**
     * `UsersModule`:
     * - Provides user management functionality.
     * - Required for user validation during authentication.
     */
    UsersModule,
    /**
     * `LoggerModule`:
     * - Enables structured and centralized logging for debugging and monitoring.
     */
    LoggerModule,
    /**
     * `ConfigModule`:
     * - Configures environment variables globally across the application.
     * - Validates critical variables using Joi.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    /**
     * `JwtModule`:
     * - Registers the JSON Web Token module asynchronously.
     * - Configures the JWT secret and expiration dynamically using environment variables.
     */
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController, // Handles HTTP routes related to authentication, such as login or token issuance.
  ],
  providers: [
    AuthService, // Implements the business logic for authentication, such as validating users and issuing tokens.
    LocalStrategy,
  ],
})
export class AuthModule {}
