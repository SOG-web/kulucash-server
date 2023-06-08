import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { TelemarketingModule } from './telemarketing/telemarketing.module';
import { VerificationModule } from './verification/verification.module';
import { CollectionModule } from './collection/collection.module';
import { CustomerServiceModule } from './customer-service/customer-service.module';
import { AccountantModule } from './accountant/accountant.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { SmsModule } from './sms/sms.module';
import { PaymentModule } from './payment/payment.module';
import { DojahModule } from './dojah/dojah.module';

@Module({
  imports: [
    SmsModule,
    PaymentModule,
    DojahModule,
    ScheduleModule.forRoot(),
    AuthModule,
    AdminModule,
    UsersModule,
    TelemarketingModule,
    VerificationModule,
    CollectionModule,
    CustomerServiceModule,
    AccountantModule,
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.local',
        '.env',
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
