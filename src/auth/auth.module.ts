import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { AdminService } from 'src/admin/admin.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from 'src/sms/sms.service';
import { DojahService } from 'src/dojah/dojah.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AdminService,
    UsersService,
    PrismaService,
    JwtService,
    SmsService,
    DojahService,
  ],
})
export class AuthModule {}
