import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoanStatus, Role } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto, LoginAdminDto } from './dto/admin.dto';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { SmsService } from 'src/sms/sms.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
    private smsService: SmsService,
  ) {}

  async createAdmin(data: CreateAdminDto) {
    try {
      const adminExist = await this.prisma.admin.findUnique({
        where: {
          email: data.email,
        },
      });

      if (adminExist) {
        throw new ForbiddenException({
          details: 'Admin Already Exist',
          status: false,
          data: null,
        });
      }

      const hashedPassword = await argon.hash(data.password);

      const admin = await this.prisma.admin.create({
        data: {
          ...data,
          password: hashedPassword,
          role: Role.ADMIN,
        },
      });

      delete admin.password;

      const token = this.signToken(admin.id, admin.email, admin.role);

      return {
        status: true,
        token,
        data: admin,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async loginAdmin(data: LoginAdminDto) {
    try {
      const adminExist = await this.prisma.admin.findUnique({
        where: {
          phone_number: data.phone_number,
        },
      });

      if (!adminExist) {
        throw new ForbiddenException({
          details: 'Admin does not exist',
          status: false,
          data: null,
        });
      }

      const passwordMatch = await argon.verify(
        adminExist.password,
        data.password,
      );

      if (!passwordMatch) {
        throw new ForbiddenException({
          details: 'Invalid Credentials',
          status: false,
          data: null,
        });
      }

      delete adminExist.password;

      const token = this.signToken(
        adminExist.id,
        adminExist.email,
        adminExist.role,
      );

      return {
        status: true,
        token,
        data: adminExist,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async createStaff(data: CreateStaffDto) {
    try {
      const workerExist = await this.prisma.staff.findUnique({
        where: {
          email: data.email,
        },
      });

      if (workerExist) {
        throw new ForbiddenException({
          details: 'Worker Already Exist',
          status: false,
          data: null,
        });
      }

      const generatedPassword = Math.random().toString(36).slice(-8);

      const hashedPassword = await argon.hash(generatedPassword);

      const staff = await this.prisma.staff.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      delete staff.password;

      // send sms to staff
      const message = `Hello ${staff.first_name} ${staff.last_name}, your password is ${generatedPassword}. Please change your password immediately.`;

      await this.smsService.sendSMS({ to: [staff.phone_number], message });

      return {
        status: true,
        data: staff,
        message: 'Worker Created Successfully',
      };
    } catch (error) {
      // check if error is not instance of PrismaClientKnownRequestError and delete staff
      if (!(error instanceof PrismaClientKnownRequestError)) {
        await this.prisma.staff.delete({
          where: {
            phone_number: data.phone_number,
          },
        });
      }
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  async getStaffs() {
    try {
      const staff = await this.prisma.staff.findMany({});

      return {
        status: true,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        data: error,
        message: 'Error getting Staffs',
      });
    }
  }

  async editStaff(data: UpdateStaffDto) {
    try {
      const staff = await this.prisma.staff.update({
        data,
        where: {
          id: data.id,
        },
      });

      return {
        status: true,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: true,
        data: error,
        message: 'Error Occured',
      });
    }
  }

  async lockStaff(id: string, lock: boolean) {
    try {
      const staff = await this.prisma.staff.update({
        data: {
          lock,
        },
        where: {
          id,
        },
      });

      return {
        status: true,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: true,
        data: error,
        message: 'Error Occured',
      });
    }
  }

  async lockManyStaffs(ids: string[], lock: boolean) {
    try {
      const staff = await this.prisma.staff.updateMany({
        data: {
          lock,
        },
        where: {
          id: {
            in: ids,
          },
        },
      });

      return {
        status: true,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: true,
        data: error,
        message: 'Error Occured',
      });
    }
  }

  async deleteStaff(id: string) {
    try {
      const staff = await this.prisma.staff.delete({
        where: {
          id,
        },
      });

      return {
        status: true,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: true,
        data: error,
        message: 'Error Occured',
      });
    }
  }

  async getDashboard(): Promise<any> {
    try {
      const loans = await this.prisma.loans.count();

      const pendingLoans = await this.prisma.loans.count({
        where: {
          status: LoanStatus.PENDING,
        },
      });

      const disbursedLoans = await this.prisma.loans.findMany({
        where: {
          status: LoanStatus.DISBURSED,
        },
      });

      const totalDisbursedLoans = disbursedLoans.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );

      const recentRepayments = await this.prisma.loans.findMany({
        where: {
          status: {
            in: [LoanStatus.PAID, LoanStatus.PARTIALLY_PAID],
          },
        },
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
      });

      // get wallet balance from paystack

      return {
        status: true,
        data: {
          totalLoanApplications: loans,
          pendingLoanApplications: pendingLoans,
          totalDisbursedLoans,
          walletBalance: 500000,
          recentRepayments,
        },
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error Ocurred',
        data: error,
      });
    }
  }

  signToken(userId: string, email: string, role: string): string {
    const payload = { userId, email, role };

    const secret = process.env.JWT_SECRET || this.config.get('JWT_SECRET');
    return this.jwt.sign(payload, { expiresIn: '1d', secret: secret });
  }
}
