import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';
import { LoginUserDto } from './dto/login_user.dto';
import { CallStatus, Role } from '@prisma/client';
import { DojahService } from 'src/dojah/dojah.service';
import { SmsService } from 'src/sms/sms.service';
import { OtpChannel, OtpTokenType } from 'src/sms/enums/otp.enums';
import { createBankAccountDto } from './dto/bank.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
    private dojah: DojahService,
    private sms: SmsService,
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

      // remove data.bvn_data from data
      const { bvn_data, ...rest } = data;

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          level: 1,
          max_amount: 7000,
          min_amount: 1000,
          role: Role.USER,
        },
      });

      await this.prisma.userProperties.create({
        data: {
          telemarketer_call_status: CallStatus.NOTCALLED,
          verificator_call_status: CallStatus.NOTCALLED,
          collector_call_status: CallStatus.NOTCALLED,
          customer_service_call_status: CallStatus.NOTCALLED,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await this.prisma.bvnData.create({
        data: {
          ...bvn_data,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const token = this.signToken(user.id, user.email, user.role);

      return {
        status: true,
        token: token,
      };
    } catch (error) {
      try {
        await this.prisma.user.delete({
          where: {
            email: data.email,
          },
        });

        await this.prisma.bvnData.delete({
          where: {
            bvn: data.bvn,
          },
        });
      } catch (error) {}

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
        token: token,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async sendOtp(phone_number: string) {
    try {
      const otp = await this.sms.sendOTP({
        meta_data: { phone_number: phone_number },
        channel: OtpChannel.SMS,
        sender: 'SAlert',
        token_type: OtpTokenType.NUMERIC,
        token_length: 4,
        expiration_time: 5,
        customer_mobile_number: phone_number,
        customer_email_address: 'sample@sample.com',
      });

      return {
        status: true,
        data: {
          reference: otp.data.data.reference,
          code: otp.data.data.token,
        },
        message: 'OTP Sent',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async verifyOtp(code: string, ref: string) {
    try {
      const otp = await this.sms.confirmOTP({
        verification_reference: ref,
        verification_code: code,
      });

      if (otp.code !== 200) {
        throw new ForbiddenException({
          message: 'Invalid OTP',
          status: false,
          data: {},
        });
      }

      return {
        status: true,
        data: {},
        message: 'OTP Verified',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async changePassword(userId: string, password: string, newPassword: string) {
    try {
      const existingPassword = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const passwordMatch = await argon.verify(
        existingPassword.password,
        password,
      );

      if (!passwordMatch) {
        throw new ForbiddenException({
          message: 'Wrong Password',
          status: false,
          data: {},
        });
      }

      const hashedPassword = await argon.hash(newPassword);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        status: true,
        data: {},
        message: 'Password Changed',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async resetPassword(userId: string, newPassword: string) {
    try {
      const hashedPassword = await argon.hash(newPassword);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        status: true,
        data: {},
        message: 'Password Reset',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async verifyBvn(bvn: string) {
    try {
      const bvnData = await this.dojah.checkBvn(bvn);

      return {
        status: true,
        data: {
          ...bvnData.entity,
          image: '',
        },
        message: 'BVN Verified',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async getBankList() {
    try {
      const banks = await this.dojah.getBanks();

      return {
        status: true,
        data: banks.entity,
        message: 'Bank List Fetched',
      };
    } catch (error) {
      throw new ForbiddenException({
        message: `${error}`,
        status: false,
        data: {},
      });
    }
  }

  async createBankAccount(userId: string, data: createBankAccountDto) {
    try {
      //TODO: verify account details first
      const bank = await this.prisma.bankDetail.create({
        data: {
          ...data,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        status: true,
        message: 'Bank Created Successfully',
        data: bank,
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error creating Bank',
        data: null,
      });
    }
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
          UserProperties: {
            include: {
              Loans: true,
              Disbursement: true,
              ChatList: true,
            },
          },
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
