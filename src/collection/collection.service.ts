import { ForbiddenException, Injectable } from '@nestjs/common';
import { CallStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async dashboard(role: Role, userId: string) {
    try {
      if (role === Role.TEAMLEADER) {
        const totalAmountCollected = this.prisma.loanRepayment.aggregate({
          _sum: { amount: true },
        });

        const totalAmountOwed = this.prisma.loans.aggregate({
          where: { paid: false },
          _sum: { amount_owed: true },
        });

        const totalAssignedCases = this.prisma.userProperties.count({
          where: {
            NOT: { collector_handler_id: null },
            AND: {
              Loans: {
                every: { paid: false },
              },
            },
          },
        });

        const totalCases = this.prisma.loans.count({
          where: { paid: false },
        });

        const recentCalled = this.prisma.userProperties.findMany({
          where: { collector_call_status: CallStatus.CALLED },
          take: 10,
          orderBy: { collector_call_time: 'desc' },
        });

        return {
          data: {
            totalAmountCollected,
            totalAmountOwed,
            totalAssignedCases,
            totalCases,
            recentCalled,
          },
          status: true,
          message: 'Dashboard data fetched successfully',
        };
      }

      const totalAmountCollected = this.prisma.loanRepayment.aggregate({
        where: { handler_id: userId },
        _sum: { amount: true },
      });

      const totalAmountOwed = this.prisma.userProperties.aggregate({
        where: {
          collector_handler_id: userId,
          AND: {
            Loans: {
              every: { paid: false },
            },
          },
        },
      });

      const totalAssignedCases = this.prisma.userProperties.count({
        where: {
          collector_handler_id: userId,
        },
      });

      const totalClosedCases = this.prisma.userProperties.count({
        where: {
          collector_handler_id: userId,
          Loans: {
            every: { paid: true },
          },
        },
      });

      const recentCalled = this.prisma.userProperties.findMany({
        where: {
          collector_handler_id: userId,
          collector_call_status: CallStatus.CALLED,
        },
      });

      return {
        data: {
          totalAmountCollected,
          totalAmountOwed,
          totalAssignedCases,
          totalClosedCases,
          recentCalled,
        },
        status: true,
        message: 'Dashboard data fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: error.message,
        status: false,
        data: null,
      });
    }
  }

  async getClients(role: Role, userId: string): Promise<any> {
    try {
      if (role === Role.TEAMLEADER) {
        const clients = await this.prisma.userProperties.findMany({
          where: {
            Loans: {
              every: { paid: false },
            },
          },
          include: {
            user: true,
          },
        });

        return {
          data: clients,
          status: true,
          message: 'Clients fetched successfully',
        };
      }

      const clients = await this.prisma.userProperties.findMany({
        where: {
          collector_handler_id: userId,
          Loans: {
            every: { paid: false },
          },
        },
        include: {
          user: true,
        },
      });

      return {
        data: clients,
        status: true,
        message: 'Clients fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: error.message,
        status: false,
        data: null,
      });
    }
  }

  async getStaffList(): Promise<any> {
    try {
      const staffList = await this.prisma.staff.findMany();

      const staffListUpdated = staffList.map(async (staff) => {
        const totalAssignedCases = await this.prisma.userProperties.count({
          where: {
            collector_handler_id: staff.id,
            AND: {
              Loans: {
                every: { paid: false },
              },
            },
          },
        });

        const totalAmountCollected = await this.prisma.loanRepayment.aggregate({
          where: { handler_id: staff.id },
          _sum: { amount: true },
        });

        const totalAmountCollectedInPercent =
          (totalAmountCollected._sum.amount / 100) * 100;

        const totalClosedCases = await this.prisma.loanRepayment.count({
          where: { handler_id: staff.id, AND: { loan: { paid: true } } },
        });

        const todayAssignedCases = await this.prisma.userProperties.count({
          where: {
            collector_handler_id: staff.id,
            AND: [
              {
                Loans: {
                  every: { paid: false },
                },
              },
              {
                updated_at: {
                  equals: new Date(),
                },
              },
            ],
          },
        });

        const todayAmountCollected = await this.prisma.loanRepayment.aggregate({
          where: {
            handler_id: staff.id,
            AND: [
              {
                updated_at: {
                  equals: new Date(),
                },
              },
            ],
          },
          _sum: { amount: true },
        });

        const todayAmountCollectedInPercent =
          (todayAmountCollected._sum.amount / 100) * 100;

        const todayClosedCases = await this.prisma.loanRepayment.count({
          where: {
            handler_id: staff.id,
            AND: [
              {
                loan: {
                  paid: true,
                },
              },
              {
                updated_at: {
                  equals: new Date(),
                },
              },
            ],
          },
        });

        return {
          ...staff,
          totalAssignedCases,
          totalAmountCollected: totalAmountCollected._sum.amount,
          totalAmountCollectedInPercent,
          totalClosedCases,
          todayAssignedCases,
          todayAmountCollected: todayAmountCollected._sum.amount,
          todayAmountCollectedInPercent,
          todayClosedCases,
        };
      });

      return {
        data: await Promise.all(staffListUpdated),
        status: true,
        message: 'Staff list fetched successfully',
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
