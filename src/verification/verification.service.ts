import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CallStatus, Department, LoanStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async dashboard(role: Role, userId: string) {
    try {
      if (role === Role.TEAMLEADER) {
        const total = await this.prisma.user.count({
          where: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.PENDING,
              },
            },
          },
        });

        const accepted = await this.prisma.user.count({
          where: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.APPROVED,
              },
            },
          },
        });

        const rejected = await this.prisma.user.count({
          where: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.REJECTED,
              },
            },
          },
        });

        const recentCalled = await this.prisma.userProperties.findMany({
          where: { verificator_call_status: CallStatus.CALLED },
          take: 10,
          orderBy: { verificator_call_time: 'desc' },
        });

        return { total, accepted, rejected, recentCalled };
      }

      const total = await this.prisma.user.count({
        where: {
          UserProperties: {
            verificator_handler_id: userId,
          },
          AND: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.PENDING,
              },
            },
          },
        },
      });

      const accepted = await this.prisma.user.count({
        where: {
          UserProperties: {
            verificator_handler_id: userId,
          },
          AND: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.APPROVED,
              },
            },
          },
        },
      });

      const rejected = await this.prisma.user.count({
        where: {
          UserProperties: {
            verificator_handler_id: userId,
          },
          AND: {
            Loans: {
              every: {
                loan_request_status: LoanStatus.REJECTED,
              },
            },
          },
        },
      });

      const recentCalled = await this.prisma.userProperties.findMany({
        where: {
          verificator_handler_id: userId,
          verificator_call_status: CallStatus.CALLED,
        },
        take: 10,
        orderBy: { verificator_call_time: 'desc' },
      });

      return { total, accepted, rejected, recentCalled };
    } catch (error) {
      throw new ForbiddenException({
        message: error.message,
        status: false,
        data: null,
      });
    }
  }

  async getClients(role: string, userId: string): Promise<any> {
    try {
      if (role === Role.TEAMLEADER) {
        const users = await this.prisma.user.findMany({
          where: {
            Loans: {
              every: {
                loan_request_status: {
                  notIn: [
                    LoanStatus.DISBURSED,
                    LoanStatus.PARTIALLY_PAID,
                    LoanStatus.PAID,
                  ],
                },
              },
            },
          },
          include: {
            UserProperties: true,
            Comment: {
              include: {
                staff: true,
              },
              where: {
                department: Department.VERIFICATOR,
              },
            },
            Loans: true,
          },
        });
        return {
          data: users,
          status: true,
          message: 'success',
        };
      }

      const users = await this.prisma.user.findMany({
        where: {
          UserProperties: {
            verificator_handler_id: userId,
          },
          AND: {
            Loans: {
              every: {
                loan_request_status: {
                  notIn: [
                    LoanStatus.DISBURSED,
                    LoanStatus.PARTIALLY_PAID,
                    LoanStatus.PAID,
                  ],
                },
              },
            },
          },
        },
        include: {
          UserProperties: true,
          Comment: {
            include: {
              staff: true,
            },
            where: {
              department: Department.VERIFICATOR,
            },
          },
          Loans: true,
        },
      });

      return {
        data: users,
        status: true,
        message: 'success',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: error.message,
        status: false,
        data: null,
      });
    }
  }
}
