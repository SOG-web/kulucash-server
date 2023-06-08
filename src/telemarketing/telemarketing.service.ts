import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  CallStatus,
  Department,
  Role,
  TeleMarketerUserStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TelemarketingService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

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

  async getstaffList(): Promise<any> {
    try {
      const staffList = await this.prisma.staff.findMany({
        where: { department: Department.TELEMARKETER },
      });

      return {
        data: staffList,
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
          include: { UserProperties: true, Comment: true },
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
          Comment: true,
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

  async assignClient(handler_id: string, userIds: string[]): Promise<any> {
    try {
      const assignment = await this.prisma.userProperties.updateMany({
        data: {
          telemarketer_handler_id: handler_id,
        },
        where: {
          userId: { in: userIds },
        },
      });

      return {
        data: assignment,
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

  async addComment(
    userId: string,
    comment: string,
    staffId: string,
  ): Promise<any> {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          comment,
          department: Department.TELEMARKETER,
          user: { connect: { id: userId } },
          staff: { connect: { id: staffId } },
        },
      });

      return {
        data: newComment,
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
