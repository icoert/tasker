import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

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
  constructor(private readonly configService: ConfigService) {}

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
   * Creates a new charge using the Stripe API.
   * - Creates a payment method for the provided card details.
   * - Creates and confirms a payment intent with the specified amount.
   *
   * @param {CreateChargeDto} createChargeDto - The data transfer object containing payment details:
   *   - `card`: The card details for processing the payment.
   *     - Example: `{ number: '4242424242424242', exp_month: 12, exp_year: 2024, cvc: '123' }`.
   *   - `amount`: The amount to be charged, in USD.
   *
   * @returns {Promise<Stripe.PaymentIntent>} A promise resolving to the created payment intent.
   *   - Contains details of the payment, such as status, amount, and payment method.
   *
   * @throws {Stripe.errors} If any error occurs during payment processing.
   */
  async createCharge({ card, amount }: CreateChargeDto) {
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
