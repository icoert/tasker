import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

/**
 * The PaymentsController handles incoming microservice messages related to payment operations.
 * - Listens for specific message patterns and delegates the processing to the `PaymentsService`.
 */
@Controller()
export class PaymentsController {
  /**
   * Constructor for PaymentsController.
   * - Injects the `PaymentsService` to handle business logic for payment operations.
   *
   * @param {PaymentsService} paymentsService - The service responsible for processing payment operations.
   */
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Handles the `create_charge` message pattern to create a new charge.
   * - Delegates the creation of a charge to the `PaymentsService`.
   *
   * @param {CreateChargeDto} data - The Data Transfer Object containing payment details:
   *   - `card`: The card details for processing the payment.
   *     - Example: `{ number: '4242424242424242', exp_month: 12, exp_year: 2024, cvc: '123' }`.
   *   - `amount`: The amount to be charged, in USD.
   *
   * @returns {Promise<Stripe.PaymentIntent>} A promise that resolves to the created payment intent.
   *   - Contains details such as payment status, amount, and payment method.
   */
  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
