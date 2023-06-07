import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // console.log({ payload });

    if (payload.role === Role.ADMIN) {
      const user = await this.prisma.admin.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) throw new BadRequestException('Admin not found');

      delete user?.password;
      // console.log(user);
      return user;
    }

    if (payload.role === Role.USER) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) throw new BadRequestException('User not found');

      delete user?.password;
      // console.log(user);
      return user;
    } else {
      const user = await this.prisma.staff.findUnique({
        where: {
          id: payload.userId,
        },
      });
      // console.log({ user });
      if (!user) throw new BadRequestException('Staff not found');
      delete user.password;

      return user;
    }
  }
}
