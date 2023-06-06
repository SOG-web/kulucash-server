import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { LoginUserDto } from './dto/login_user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (userExists) {
        throw new ForbiddenException('User already exists');
      }

      const hashedPassword = await argon.hash(data.password);

      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          level: 1,
          max_amount: 7000,
          min_amount: 1000,
          role: Role.USER,
          bvn_data: {
            create: {
              ...data.bvn_data,
            },
          },
        },
      });

      const token = this.signToken(user.id, user.email, user.role);

      return {
        status: true,
        access_token: token,
        refresh_token: token,
      };
    } catch (error) {
      throw new ForbiddenException({
        details: `${error}`,
        status: false,
      });
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          phone_number: data.phone_number,
        },
      });

      if (!user) {
        throw new ForbiddenException({
          message: 'Invalid User',
          status: false,
          data: {},
        });
      }

      const passwordMatch = await argon.verify(user.password, data.password);

      if (!passwordMatch) {
        throw new ForbiddenException({
          message: 'Wrong Password',
          status: false,
          data: {},
        });
      }

      const token = this.signToken(user.id, user.email, user.role);

      return {
        status: true,
        access_token: token,
        refresh_token: token,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async sedOtp(phone_number: string) {
    try {
    } catch (error) {}
  }

  async verifyOtp(phone_number: string, otp: string) {
    try {
    } catch (error) {}
  }

  async changePassword(userId: string, password: string) {
    try {
    } catch (error) {}
  }

  async verifyBvn(bvn: string) {
    try {
    } catch (error) {}
  }

  async verifyAccountNumber(account_number: string, bank_code: string) {
    try {
    } catch (error) {}
  }

  async createBankAccount(userId: string, data: any) {
    try {
    } catch (error) {}
  }

  async getBankAccounts(userId: string) {
    try {
      const bankAccounts = await this.prisma.bankDetail.findMany({
        where: {
          id: userId,
        },
      });

      return {
        status: true,
        data: bankAccounts,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async getProlfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          BankDetail: true,
          bvn_data: true,
          CardDetail: true,
          ColleagueContact: true,
          EmergencyContact: true,
          EmploymentDetails: true,
          Loans: true,
        },
      });

      return {
        status: true,
        data: user,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  signToken(userId: string, email: string, role: string): string {
    const payload = { userId, email, role };

    const secret = process.env.JWT_SECRET || this.config.get('JWT_SECRET');
    return this.jwt.sign(payload, { expiresIn: '1d', secret: secret });
  }
}
