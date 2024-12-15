import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Service for handling email notifications.
 * - Configures and uses Nodemailer with Gmail OAuth2 for sending emails.
 */
@Injectable()
export class NotificationsService {
  /**
   * Constructor for NotificationsService.
   * - Injects the ConfigService to access environment variables for SMTP configuration.
   *
   * @param {ConfigService} configService - Provides access to configuration values.
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a Nodemailer transporter instance for sending emails.
   * - Uses Gmail as the email service.
   * - Configures OAuth2 authentication with client credentials and a refresh token.
   */
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  /**
   * Sends an email notification.
   * - Uses the configured transporter to send an email to the specified recipient.
   *
   * @param {NotifyEmailDto} data - The email notification details:
   *   - `email`: The recipient's email address.
   *   - `text`: The body of the email message.
   *
   * @returns {Promise<void>} Resolves when the email is successfully sent.
   */
  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Tasker Notification',
      text,
    });
  }
}
