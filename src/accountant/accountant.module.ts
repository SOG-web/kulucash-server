import { Module } from '@nestjs/common';
import { AccountantController } from './accountant.controller';
import { AccountantService } from './accountant.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [AccountantController],
  providers: [AccountantService, PrismaService, PaymentService],
})
export class AccountantModule {}
