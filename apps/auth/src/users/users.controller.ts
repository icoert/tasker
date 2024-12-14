import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../curent-user.decorator';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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

  /**
   * Handles a GET request to retrieve the details of the authenticated user.
   * - Protects the route with the `JwtAuthGuard` to ensure only authenticated users can access it.
   * - Uses the `@CurrentUser` decorator to extract the authenticated user's details from the request.
   *
   * @returns {Promise<UserDocument>} The user document of the authenticated user.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
