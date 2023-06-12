import { ForbiddenException, Injectable } from '@nestjs/common';

import { CallStatus, Role, TeleMarketerUserStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TelemarketingService {
  constructor(private prisma: PrismaService) {}

  async dashboard(role: Role, userId: string) {
    try {
      if (role === Role.TEAMLEADER) {
        const total = await this.prisma.user.count();
        const active = await this.prisma.userProperties.count({
          where: { telemarketer_status: TeleMarketerUserStatus.ACTIVE },
        });
        const inactive = await this.prisma.userProperties.count({
          where: { telemarketer_status: TeleMarketerUserStatus.INACTIVE },
        });

        const backslidden = await this.prisma.userProperties.count({
          where: { telemarketer_status: TeleMarketerUserStatus.BACKSLIDDEN },
        });

        const recentCalled = await this.prisma.userProperties.findMany({
          where: { telemarketer_call_status: CallStatus.CALLED },
          take: 10,
          orderBy: { telemarketer_call_time: 'desc' },
        });

        return { total, active, inactive, backslidden, recentCalled };
      }

      const total = await this.prisma.userProperties.count({
        where: { telemarketer_handler_id: userId },
      });

      const active = await this.prisma.userProperties.count({
        where: {
          telemarketer_handler_id: userId,
          telemarketer_status: TeleMarketerUserStatus.ACTIVE,
        },
      });

      const inactive = await this.prisma.userProperties.count({
        where: {
          telemarketer_handler_id: userId,
          telemarketer_status: TeleMarketerUserStatus.INACTIVE,
        },
      });

      const backslidden = await this.prisma.userProperties.count({
        where: {
          telemarketer_handler_id: userId,
          telemarketer_status: TeleMarketerUserStatus.BACKSLIDDEN,
        },
      });

      const recentCalled = await this.prisma.userProperties.findMany({
        where: {
          telemarketer_handler_id: userId,
          telemarketer_call_status: CallStatus.CALLED,
        },
        take: 10,
        orderBy: { telemarketer_call_time: 'desc' },
      });

      return {
        data: { total, active, inactive, backslidden, recentCalled },
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

  async getClients(role: string, userId: string): Promise<any> {
    try {
      if (role === Role.TEAMLEADER) {
        const users = await this.prisma.user.findMany({
          include: {
            UserProperties: true,
            Comment: {
              include: {
                staff: true,
              },
            },
            BankDetail: true,
            Loans: true,
            EmergencyContact: true,
            EmploymentDetails: true,
            ColleagueContact: true,
            bvn_data: true,
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
            telemarketer_handler_id: userId,
          },
        },
        include: {
          UserProperties: true,
          Comment: {
            include: {
              staff: true,
            },
          },
          BankDetail: true,
          Loans: true,
          EmergencyContact: true,
          EmploymentDetails: true,
          ColleagueContact: true,
          bvn_data: true,
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
