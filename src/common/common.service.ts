import { ForbiddenException, Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private prisma: PrismaService) {}

  async getstaffList(department: Department): Promise<any> {
    try {
      const staffList = await this.prisma.staff.findMany({
        where: { department },
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

  async addComment(
    userId: string,
    comment: string,
    staffId: string,
    department: Department,
  ): Promise<any> {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          comment,
          department,
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

  async assignClient(userIds: string[], data: any): Promise<any> {
    try {
      const assignment = await this.prisma.userProperties.updateMany({
        data,
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

  async updateCallProgress(userId: string, data: any): Promise<any> {
    try {
      const user = await this.prisma.userProperties.update({
        where: { userId },
        data,
      });

      return {
        data: user,
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
