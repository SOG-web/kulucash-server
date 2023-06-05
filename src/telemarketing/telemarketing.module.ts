import { Module } from '@nestjs/common';
import { TelemarketingController } from './telemarketing.controller';
import { TelemarketingService } from './telemarketing.service';

@Module({
  controllers: [TelemarketingController],
  providers: [TelemarketingService]
})
export class TelemarketingModule {}
