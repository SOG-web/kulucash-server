import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateLoansOverdueCategory } from './jobs/jobs';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);

  constructor(private prisma: PrismaService) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 30 seconds');
  // }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async everdayMidnightCron() {
    this.logger.debug('Called every day at midnight');
    //DONE: check loans that are due for payment and add due category
    updateLoansOverdueCategory(this.prisma, this.logger);
    //TODO: check cleared loan intrest, if it is up to 24 hours and loan not cleared return the loan intrest to the loan
    //TODO: check loans that are due for payment and send email to users
  }
}
