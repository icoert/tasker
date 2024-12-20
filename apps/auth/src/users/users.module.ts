import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, UserDocument, UserSchema } from '@app/common';
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
  ],
  controllers: [UsersController], // Defines the controller for handling user-related HTTP routes
  providers: [
    UsersService, // Provides business logic for user operations
    UsersRepository, // Handles database interactions for the User schema
  ],
  exports: [UsersService], // Makes UsersService available to other modules
})
export class UsersModule {}
