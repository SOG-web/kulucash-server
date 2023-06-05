import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { InitTransactionDto, VerifyTransactionDto } from './dto/payment.dto';
import { initPaymentReq, verifyPaymentReq } from './objects/payment.req.obj';
import { initPayment, verifyPayment } from './objects/payment.res.obj';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('init')
  @ApiOperation({ summary: 'Initialize a payment process' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: initPayment,
    },
  })
  @ApiBody({
    required: true,
    schema: {
      example: initPaymentReq,
    },
  })
  async initTransaction(@Body() data: InitTransactionDto, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req as User;
    return await this.paymentService.initTransaction(data);
  }
  @Get('verify')
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: verifyPayment },
  })
  @ApiQuery({
    required: true,
    schema: {
      example: verifyPaymentReq,
    },
  })
  async verifyTransaction(@Query() query: VerifyTransactionDto) {
    return await this.paymentService.verifyTransaction(query);
  }
  @Get('get-cards')
  @ApiOperation({ summary: 'Get All Cards available' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: { example: verifyPayment },
  })
  async viewCards(@Req() req: Request) {
    // const { id }: { id?: string } = req.user;
    return await this.paymentService.getAllCard();
  }
  @Post('paystack-webhook')
  async paystackWebHook(@Req() req: Request, @Res() res: Response) {
    return await this.paymentService.payStackWebHook(req, res);
  }
}
