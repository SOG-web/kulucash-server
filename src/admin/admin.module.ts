import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from 'src/sms/sms.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, JwtService, SmsService],
})
export class AdminModule {}
