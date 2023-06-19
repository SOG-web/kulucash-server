import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DojahService } from 'src/dojah/dojah.service';
import { SmsService } from 'src/sms/sms.service';
import { UsersService2 } from './users.2.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersService2,
    PrismaService,
    JwtService,
    DojahService,
    SmsService,
    CloudinaryService,
  ],
})
export class UsersModule {}
