import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  everdayMidnightCron() {
    this.logger.debug('Called every day at midnight');
    //TODO: check loans that are due for payment and add due category
  }
}
