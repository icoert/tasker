import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

/**
 * The PaymentsService handles payment-related operations using the Stripe API.
 * - Manages payment processing, including creating charges and payment intents.
 */
@Injectable()
export class PaymentsService {
  /**
   * Constructor for PaymentsService.
   * - Injects the `ConfigService` to access environment variables.
   *
   * @param {ConfigService} configService - Provides access to the `STRIPE_SECRET_KEY`.
   */
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  /**
   * The Stripe instance initialized with the secret key and API version.
   * - Configured using the `STRIPE_SECRET_KEY` environment variable.
   */
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-11-20.acacia',
    },
  );

  /**
   * Handles the creation of a payment charge using the Stripe API and sends a notification email.
   * - Creates a payment method using a test token (`tok_mastercard`).
   * - Creates and confirms a payment intent with the specified amount.
   * - Sends an email notification via the notification service upon successful payment.
   *
   * @param {PaymentsCreateChargeDto} createChargeDto - The data transfer object containing payment details:
   *   - `card`: The card details for processing the payment (using a tokenized card for security).
   *   - `amount`: The amount to be charged, in USD.
   *   - `email`: The user's email address for sending a notification.
   *
   * @returns {Promise<Stripe.PaymentIntent>} A promise resolving to the created payment intent.
   *   - Contains details of the payment, such as status, amount, and payment method.
   *
   * @throws {Error} If an error occurs during payment processing.
   *   - Logs the error details and throws a meaningful message.
   */
  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    try {
      console.log('Creating payment method with amount:', amount);

      // Step 1: Create a payment method
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_mastercard' },
      });
      console.log('Payment method created:', paymentMethod.id);

      // Step 2: Create and confirm the payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: amount * 100, // Convert to cents
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });
      console.log('Payment intent created:', paymentIntent.id);

      this.notificationService.emit('notify_email', {
        email,
        text: `Your payment of $${amount} has completed successfully!`,
      });

      // Return the successful payment intent
      return paymentIntent;
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error during payment processing:', error.message);

      // Throw a meaningful exception to the client
      throw new Error(
        `Failed to process payment. Reason: ${error.message || 'Unknown error'}`,
      );
    }
  }
}
