import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
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
}
