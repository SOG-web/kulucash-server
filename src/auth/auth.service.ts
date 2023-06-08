import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async loginStaff(phone_number: string, password: string) {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: {
          phone_number,
        },
      });

      if (!staff) {
        return new ForbiddenException({
          status: false,
          message: 'Invalid Credentials',
          data: null,
        });
      }

      const passwordValid = await argon.verify(staff.password, password);

      if (!passwordValid) {
        return new ForbiddenException({
          status: false,
          message: 'Invalid Credentials',
          data: null,
        });
      }

      delete staff.password;

      const token = this.signToken(
        staff.id,
        staff.email,
        staff.role,
        staff.department,
      );

      return {
        status: true,
        token,
        data: staff,
        message: 'Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Invalid Credentials',
        data: error,
      });
    }
  }

  async changePasswordStaff(
    userId: string,
    password: string,
    newPassword: string,
  ) {
    try {
      const existingPassword = await this.prisma.staff.findUnique({
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

      await this.prisma.staff.update({
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

  async resetPasswordStaff(userId: string, newPassword: string) {
    try {
      const hashedPassword = await argon.hash(newPassword);

      await this.prisma.staff.update({
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

  signToken(
    userId: string,
    email: string,
    role: string,
    department: string,
  ): string {
    const payload = { userId, email, role, department };

    const secret = process.env.JWT_SECRET || this.config.get('JWT_SECRET');
    return this.jwt.sign(payload, { expiresIn: '1d', secret: secret });
  }
}
