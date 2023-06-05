import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import axios from 'axios';

import { PrismaService } from 'src/prisma/prisma.service';
import { InitTransactionDto, VerifyTransactionDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async initTransaction(dataDTO: InitTransactionDto) {
    // console.log(this.config.get('PAYSTACK_SECRET_KEY'));
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     email: dataDTO.email,
    //   },
    // });
    // if (!user) {
    //   throw new ForbiddenException({
    //     message: 'User not found',
    //   });
    // }
    // const packageDetails = await this.prisma.package.findUnique({
    //   where: {
    //     id: dataDTO.packageId,
    //   },
    // });
    // if (!packageDetails) {
    //   throw new ForbiddenException({
    //     message: 'Package not found',
    //   });
    // }
    // const options = {
    //   method: 'POST',
    //   url: 'https://api.paystack.co/transaction/initialize',
    //   headers: {
    //     Accept: 'application/json,text/plain,*/*',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer sk_test_10cf2ad15504f404137fb527803b4e847cb14007`,
    //   },
    //   data: {
    //     email: dataDTO.packageId + '?' + dataDTO.email,
    //     amount: dataDTO.amount,
    //     first_name: dataDTO.packageId, //packageId
    //   },
    // };
    // try {
    //   const { data } = await axios(options);
    //   await this.prisma.payment.create({
    //     data: {
    //       amount: dataDTO.amount,
    //       user: {
    //         connect: {
    //           id: user.id,
    //         },
    //       },
    //       package: {
    //         connect: {
    //           id: packageDetails.id,
    //         },
    //       },
    //       reference: data?.reference || data?.data?.reference,
    //     },
    //   });
    //   // console.log(data);
    //   return data;
    // } catch (error) {
    //   // console.log(error);
    //   throw new ForbiddenException({
    //     error,
    //     message: 'Error initializing transaction',
    //   });
    // }
  }

  async getAllCard(userId?: string) {
    // const cards = await this.prisma.card.findMany({
    //   where: {
    //     userId,
    //   },
    // });
    // return cards;
  }

  async verifyTransaction(data: VerifyTransactionDto) {
    const options = {
      method: 'GET',
      url: `https://api.paystack.co/transaction/verify/${data.reference}`,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer sk_test_10cf2ad15504f404137fb527803b4e847cb14007`,
      },
    };

    try {
      const { data } = await axios(options);
      // console.log(data);

      return data;
    } catch (error) {
      // console.log(error);
      throw new ForbiddenException({
        error,
        message: 'Error verifying transaction',
      });
    }
  }

  async payStackWebHook(req: Request, res: Response) {
    const secret = 'sk_test_10cf2ad15504f404137fb527803b4e847cb14007';
    //validate event
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
      // Retrieve the request's body
      const body = req.body as bodyType;
      console.log(body);
      // if (body.event === 'charge.success') {
      //   // Do something with event
      //   const { data } = body;
      //   const { authorization, customer } = data;
      //   const email = customer.email.split('?')[1];
      //   const packageId = customer.email.split('?')[0];
      //   const user = await this.prisma.user.findUnique({
      //     where: {
      //       email: email,
      //     },
      //   });
      //   if (user) {
      //     await this.prisma.card.create({
      //       data: {
      //         last4: authorization.last4,
      //         exp_month: authorization.exp_month,
      //         exp_year: authorization.exp_year,
      //         brand: authorization.brand,
      //         channel: authorization.channel,
      //         reusable: authorization.reusable,
      //         country_code: authorization.country_code,
      //         bank: authorization.bank,
      //         signature: authorization.signature,
      //         account_name: authorization.account_name,
      //         authorization_code: authorization.authorization_code,
      //         bin: authorization.bin,
      //         card_type: authorization.card_type,
      //         user: {
      //           connect: {
      //             id: user.id,
      //           },
      //         },
      //       },
      //     });
      //     console.log('Card saved successfully');
      //     // console.log(card);
      //   }
      //   const packageDetail = await this.prisma.package.update({
      //     where: {
      //       id: packageId,
      //     },
      //     data: {
      //       paymentStatus: PaymentStatus.PAID,
      //     },
      //   });
      //   const payment = await this.prisma.payment.findFirst({
      //     where: {
      //       packageId,
      //     },
      //   });
      //   await this.prisma.payment.update({
      //     where: {
      //       id: payment.id,
      //     },
      //     data: {
      //       status: PaymentStatus.PAID,
      //       driver: {
      //         connect: {
      //           id: packageDetail.acceptedDriverId,
      //         },
      //       },
      //     },
      //   });
      // }
      // Do something with event
    }
    res.send(200);
  }
}

const successObjExample = {
  event: 'charge.success',
  data: {
    id: 2567284454,
    domain: 'test',
    status: 'success',
    reference: '82a0jal9xq',
    amount: 2000,
    message: null,
    gateway_response: 'Successful',
    paid_at: '2023-02-24T22:08:32.000Z',
    created_at: '2023-02-24T22:06:18.000Z',
    channel: 'card',
    currency: 'NGN',
    ip_address: '105.113.16.246',
    metadata: '',
    fees_breakdown: null,
    log: null,
    fees: 30,
    fees_split: null,
    authorization: {
      authorization_code: 'AUTH_57u50ees0w',
      bin: '408408',
      last4: '4081',
      exp_month: '12',
      exp_year: '2030',
      channel: 'card',
      card_type: 'visa ',
      bank: 'TEST BANK',
      country_code: 'NG',
      brand: 'visa',
      reusable: true,
      signature: 'SIG_c8IXqoKz64bu5tP5jase',
      account_name: null,
    },
    customer: {
      id: 113289359,
      first_name: null,
      last_name: null,
      email: 'emanuelmechie@gmail.com',
      customer_code: 'CUS_y2bnopvqtb2gj1s',
      phone: null,
      metadata: null,
      risk_action: 'default',
      international_format_phone: null,
    },
    plan: {},
    subaccount: {},
    split: {},
    order_id: null,
    paidAt: '2023-02-24T22:08:32.000Z',
    requested_amount: 2000,
    pos_transaction_data: null,
    source: {
      type: 'api',
      source: 'merchant_api',
      entry_point: 'transaction_initialize',
      identifier: null,
    },
  },
};
type bodyType = typeof successObjExample;
