import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  providers: [CronsService, PrismaService],
})
export class CronsModule {}
