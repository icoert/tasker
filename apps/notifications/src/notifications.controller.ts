import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

/**
 * Handles notification-related events in the application.
 * - Listens for the `notify_email` event and delegates the email notification logic to the NotificationsService.
 */
@Controller()
export class NotificationsController {
  /**
   * Constructor for NotificationsController.
   * - Injects the NotificationsService to handle notification-related business logic.
   *
   * @param {NotificationsService} notificationsService - The service responsible for handling email notifications.
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Handles the `notify_email` event to send email notifications.
   * - Processes the event payload and sends an email using the NotificationsService.
   *
   * @param {NotifyEmailDto} data - The data transfer object containing email notification details.
   *
   * @returns {Promise<void>} Resolves when the notification is sent successfully.
   */
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data);
  }
}
