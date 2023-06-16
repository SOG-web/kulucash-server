import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { BankListResponse, bankListResponse } from './objects/bank';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('get-user-profile')
  @ApiOperation({ summary: 'Get User Profile' })
  getProfile(@Req() req: Request): Promise<any> {
    const id = req.user['id'];
    return this.userService.getProlfile(id);
  }

  @Get('get-user-banks')
  @ApiOperation({ summary: 'Get Banks' })
  getBanks(@Req() req: Request): Promise<any> {
    const id = req.user['id'];
    return this.userService.getBankAccounts(id);
  }

  @Get('bank-list')
  @ApiOperation({ summary: 'Get Bank List' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    content: {
      'application/json': {
        example: bankListResponse,
      },
    },
  })
  getBankList(): Promise<BankListResponse> {
    return this.userService.getBankList();
  }
}
