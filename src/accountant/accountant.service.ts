import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DisbursementStatus, LoanStatus } from '@prisma/client';
import { DisbursementDto } from 'src/payment/dto/disbursement.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountantService {
  private readonly logger = new Logger(AccountantService.name);

  constructor(private prisma: PrismaService, private payment: PaymentService) {}

  async getDashboardData() {
    try {
      const totalClients = await this.prisma.user.count();

      const totalDebt = await this.prisma.loans.aggregate({
        where: {
          status: LoanStatus.APPROVED,
          AND: {
            paid: false,
          },
        },
        _sum: {
          amount_owed: true,
        },
      });

      const totalDebtPaid = await this.prisma.loans.aggregate({
        where: {
          status: LoanStatus.APPROVED,
          AND: {
            paid: false,
          },
        },
        _sum: {
          amount_paid: true,
        },
      });

      return {
        status: true,
        data: {
          totalClients,
          totalDebt,
          totalDebtPaid,
        },
        message: 'Successful',
      };
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async getDisbursement() {
    try {
      const disburementList = await this.prisma.loans.findMany({
        where: {
          loan_request_status: LoanStatus.APPROVED,
        },
        include: {
          UserProperties: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        status: true,
        data: disburementList,
        message: 'Successful',
      };
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async getRepayment() {
    try {
      const list = await this.prisma.loans.findMany({
        where: {
          status: LoanStatus.APPROVED,
          AND: {
            paid: false,
          },
        },
        include: {
          UserProperties: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        status: true,
        data: list,
        message: 'Successful',
      };
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async disburseLoan(id: string, userId: string) {
    try {
      const loan = await this.prisma.loans.update({
        where: {
          id,
        },
        data: {
          disbursementStatus: DisbursementStatus.PENDING,
        },
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          BankDetail: true,
        },
      });

      const loanObject: DisbursementDto = {
        id: loan.id,
      };

      // disburse loan
      const payment = await this.payment.disburseLoan(loanObject);
      // send email to user
      // send sms to user
      // Update disbursement status to disbursed

      return {
        status: true,
        data: loan,
        message: 'Successful',
      };
    } catch (error) {
      const loan = await this.prisma.loans.update({
        where: {
          id,
        },
        data: {
          disbursementStatus: DisbursementStatus.FAILED,
        },
      });
      this.logger.error(error);
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }
}
