import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { verifyObj } from './objects/bvn';

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
    return this.userService.verifyBvn(bvn);
  }
}
