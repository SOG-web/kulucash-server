import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DojahService } from 'src/dojah/dojah.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService, DojahService],
})
export class UsersModule {}
