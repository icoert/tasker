import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

/**
 * The UsersService handles the business logic for managing users.
 * It interacts with the UsersRepository for database operations.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService.
   * Injects the UsersRepository for handling database interactions related to users.
   * @param {UsersRepository} userRepository - The repository for user data.
   */
  constructor(private readonly userRepository: UsersRepository) {}

  /**
   * Creates a new user in the system.
   * Delegates the database operation to the UsersRepository.
   * @param {CreateUserDto} createUserDto - The data transfer object containing the details of the new user.
   * @returns {Promise<any>} The created user record.
   */
  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }
}
