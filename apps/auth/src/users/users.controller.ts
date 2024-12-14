import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

/**
 * The UsersController handles HTTP requests related to user operations.
 * It delegates processing to the UsersService.
 */
@Controller('users') // Defines the base route for this controller as '/users'
export class UsersController {
  /**
   * Constructor for UsersController.
   * Injects the UsersService to handle user-related business logic.
   * @param {UsersService} usersService - The service handling user operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles HTTP POST requests to create a new user.
   * @param {CreateUserDto} createUserDto - The data transfer object containing the new user's details.
   * @returns {Promise<any>} The created user record.
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
