import { Module } from '@nestjs/common';
import { MonnifyService } from './monnify.service';
import { MonnifyController } from './monnify.controller';

@Module({
  providers: [MonnifyService],
  controllers: [MonnifyController]
})
export class MonnifyModule {}
