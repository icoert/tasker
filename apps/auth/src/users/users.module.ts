import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';
import { UsersRepository } from './users.repository';

/**
 * UsersModule is responsible for handling user-related functionality.
 * It integrates database access, logging, and business logic into a single module.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController], // Defines the controller for handling user-related HTTP routes
  providers: [
    UsersService, // Provides business logic for user operations
    UsersRepository,
  ], // Handles database interactions for the User schema
})
export class UsersModule {}
