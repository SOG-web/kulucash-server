import { Module } from '@nestjs/common';
import { TelemarketingController } from './telemarketing.controller';
import { TelemarketingService } from './telemarketing.service';

import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';

@Module({
  controllers: [TelemarketingController],
  providers: [TelemarketingService, PrismaService, CommonService],
})
export class TelemarketingModule {}
