import { Module } from '@nestjs/common';
import { TelemarketingController } from './telemarketing.controller';
import { TelemarketingService } from './telemarketing.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TelemarketingController],
  providers: [TelemarketingService, PrismaService, JwtService],
})
export class TelemarketingModule {}
