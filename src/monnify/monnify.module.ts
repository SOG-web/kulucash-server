import { Module } from '@nestjs/common';
import { MonnifyService } from './monnify.service';
import { MonnifyController } from './monnify.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MonnifyService, PrismaService],
  controllers: [MonnifyController],
})
export class MonnifyModule {}
