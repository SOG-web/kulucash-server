import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto, LoginAdminDto } from 'src/admin/dto/admin.dto';
import { createAdminObj } from 'src/admin/objects/admin';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { LoginUserDto } from 'src/users/dto/login_user.dto';
import { verifyObj } from 'src/users/objects/bvn';
import { createUserObj } from 'src/users/objects/user';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/role.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('create-admin')
  @ApiOperation({ summary: 'Create new Admin' })
  @ApiBody({
    required: true,
    schema: {
      example: createAdminObj,
    },
  })
  createAdmin(@Body() data: CreateAdminDto): Promise<any> {
    return this.adminService.createAdmin(data);
  }

  @Post('login-admin')
  @ApiOperation({ summary: 'Login Admin' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        phone_number: 'phone_number',
        password: 'password',
      },
    },
  })
  loginAdmin(@Body() login: LoginAdminDto): Promise<any> {
    return this.adminService.loginAdmin(login);
  }

  @Post('login-staff')
  @ApiOperation({ summary: 'Login Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        phone_number: 'phone_number',
        password: 'password',
      },
    },
  })
  loginStaff(@Body() login: LoginAdminDto): Promise<any> {
    return this.authService.loginStaff(login.phone_number, login.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEAMLEADER, Role.TEAMMEMBER)
  @ApiBearerAuth()
  @Post('change-password-staff')
  @ApiOperation({ summary: 'Change Password Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        password: 'password',
        newPassword: 'new_password',
      },
    },
  })
  changePasswordStaff(
    @Body() data: { password: string; newPassword: string },
    @Req() req: Request,
  ): Promise<any> {
    const { userId } = req.user as any;
    return this.authService.changePasswordStaff(
      userId,
      data.password,
      data.newPassword,
    );
  }

  @Post('reset-password-staff')
  @ApiOperation({ summary: 'Reset Password Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        phone_number: 'phone_number',
      },
    },
  })
  resetPasswordStaff(
    @Body() data: { phone_number: string },
    @Req() req: Request,
  ): Promise<any> {
    const { userId } = req.user as any;
    return this.authService.resetPasswordStaff(userId, data.phone_number);
  }

  @Post('create-user')
  @ApiOperation({ summary: 'Create new User' })
  @ApiBody({
    required: true,
    schema: {
      example: createUserObj,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        status: true,
        token: 'token',
      },
    },
  })
  createUser(@Body() data: CreateUserDto): Promise<any> {
    return this.usersService.create(data);
  }

  @Post('login-user')
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        phone: 'phone',
        password: 'password',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user has logedin successfully.',
    schema: {
      example: {
        status: true,
        token: 'token',
      },
    },
  })
  loginUser(@Body() login: LoginUserDto): Promise<any> {
    return this.usersService.login(login);
  }

  @Post('send-otp-user')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        phone_number: '2348109216368',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'OTP sent successfully',
    schema: {
      example: {
        status: true,
        data: {
          reference: '',
          code: '',
        },
        message: 'OTP sent successfully',
      },
    },
  })
  sendOtp(@Body() phone_number: string): Promise<any> {
    return this.usersService.sendOtp(phone_number);
  }

  @Post('verify-otp-user')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        ref: '2348109216368',
        code: '123456',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verify successfully',
    schema: {
      example: {
        status: true,
        data: {},
        message: 'OTP verify successfully',
      },
    },
  })
  verifyOtp(@Body() data: { code: string; ref: string }): Promise<any> {
    return this.usersService.verifyOtp(data.code, data.ref);
  }

  @Get('verify-bvn')
  @ApiOperation({ summary: 'Verify BVN' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    content: {
      'application/json': {
        example: verifyObj,
      },
    },
  })
  verifyBvn(@Query('bvn') bvn: string): Promise<any> {
    return this.usersService.verifyBvn(bvn);
  }
}
