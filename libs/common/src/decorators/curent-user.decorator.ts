import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../models/user.schema';

/**
 * Utility function to extract the current user from the execution context.
 *
 * @param context - The current execution context.
 * @returns The authenticated user's document.
 */
const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

/**
 * @CurrentUser Decorator
 * Custom decorator to retrieve the authenticated user's data from the request object.
 *
 * This simplifies access to the user information within controllers and services.
 *
 * @param _data - Optional metadata (unused here).
 * @param context - The current execution context.
 * @returns The authenticated user's document.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
