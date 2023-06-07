import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto, LoginAdminDto } from 'src/admin/dto/admin.dto';
import { createAdminObj } from 'src/admin/objects/admin';
import { LoginUserDto } from 'src/users/dto/login_user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
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
        phone: 'phone_number',
        password: 'password',
      },
    },
  })
  loginAdmin(@Body() login: LoginAdminDto): Promise<any> {
    return this.adminService.loginAdmin(login);
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
  loginUser(@Body() login: LoginUserDto): Promise<any> {
    return this.usersService.login(login);
  }
}
