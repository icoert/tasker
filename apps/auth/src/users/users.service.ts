import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

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
   * - Hashes the user's password for security before saving it to the database.
   * - Delegates the database operation to the `UsersRepository`.
   *
   * @param {CreateUserDto} createUserDto - The Data Transfer Object containing the new user's details.
   *   - `email`: The user's email address.
   *   - `password`: The user's plaintext password, which will be hashed.
   *
   * @returns {Promise<any>} A promise that resolves to the created user record.
   *   - The returned object contains the user's details, with the hashed password stored in the database.
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    // Ensure the email in the DTO does not already exist in the database
    await this.validateCreateUserDto(createUserDto);

    return this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  /**
   * Validates the `CreateUserDto` to ensure the email is not already registered.
   * - Checks the database for an existing user with the same email.
   *
   * @param {CreateUserDto} createUserDto - The Data Transfer Object containing the user's details.
   *   - `email`: The user's email address to be validated.
   *
   * @throws {UnprocessableEntityException} If the email already exists in the database.
   */
  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists!');
  }

  /**
   * Verifies the user's email and password credentials.
   * - Retrieves the user from the database by their email.
   * - Compares the provided password with the stored hashed password using bcrypt.
   * - Throws an `UnauthorizedException` if the credentials are invalid.
   *
   * @param {string} email - The user's email address used for login.
   * @param {string} password - The plaintext password provided by the user.
   *
   * @returns {Promise<any>} The user object if the credentials are valid.
   *
   * @throws {UnauthorizedException} If:
   *   - The email does not exist in the database.
   *   - The password does not match the hashed password stored in the database.
   */
  async verifyUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid!');
    }

    return user;
  }

  /**
   * Retrieves a user from the database based on the provided criteria.
   * - Delegates the database query to the `userRepository`.
   * - Returns the first user document that matches the criteria specified in the DTO.
   *
   * @param {GetUserDto} getUserDto - The Data Transfer Object containing the query criteria for retrieving the user.
   *   - Can include fields such as `email` or `_id` depending on the implementation of `GetUserDto`.
   *
   * @returns {Promise<UserDocument | null>} A promise that resolves to the user document if found, or `null` if no user matches the criteria.
   */
  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }
}
