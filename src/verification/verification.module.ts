import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, PrismaService, CommonService],
})
export class VerificationModule {}
