import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';

@Module({
  imports: [],
  providers: [CronsService],
})
export class CronsModule {}
