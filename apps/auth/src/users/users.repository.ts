import { AbstractRepository, UserDocument } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/**
 * The UsersRepository provides direct database access for user-related operations.
 * It extends the AbstractRepository to leverage shared repository logic.
 */
@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  /**
   * Logger instance scoped to the UsersRepository class.
   * Provides logging functionality for repository operations.
   * @protected
   * @readonly
   */
  protected readonly logger = new Logger(UsersRepository.name);

  /**
   * Constructor for UsersRepository.
   * Injects the User model for database operations and passes it to the AbstractRepository.
   * @param {Model<UserDocument>} userModel - The Mongoose model for the User entity.
   */
  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel); // Pass the injected user model to the base AbstractRepository
  }
}
