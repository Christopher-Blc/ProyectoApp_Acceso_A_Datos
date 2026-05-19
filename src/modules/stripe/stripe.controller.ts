import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  HttpCode,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/auth.types';
import { normalizeError } from '../../common/utils/error.util';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un PaymentIntent de Stripe para una reserva' })
  async createPaymentIntent(
    @Body() dto: CreatePaymentIntentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user!.sub);
    this.logger.log(
      `Usuario ${userId} solicita PaymentIntent para reserva ${dto.reservationId}`,
    );
    try {
      return await this.stripeService.createPaymentIntent(dto.reservationId, userId);
    } catch (error) {
      const { message } = normalizeError(error);
      this.logger.error(`Error creando PaymentIntent: ${message}`);
      throw error;
    }
  }

  /**
   * Endpoint público para eventos de Stripe.
   * NO protegido con AuthGuard — Stripe no envía JWT.
   * Usa req.rawBody (habilitado con rawBody:true en main.ts) para verificar firma.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  @ApiOperation({ summary: 'Webhook de Stripe (uso interno, no llamar manualmente)' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    try {
      const rawBody: Buffer = req.rawBody;
      await this.stripeService.handleWebhook(signature, rawBody);
    } catch (error) {
      const { message } = normalizeError(error);
      this.logger.error(`Error en webhook de Stripe: ${message}`);
      throw error;
    }
  }
}
