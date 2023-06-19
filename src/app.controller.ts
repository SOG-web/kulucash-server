import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  LoanStatus,
  Department,
  Role,
  CallStatus,
  TeleMarketerUserStatus,
  StaffStatus,
  OverDueCategory,
  DisbursementStatus,
} from '@prisma/client';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/role.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEAMLEADER, Role.TEAMMEMBER)
  @Get('enums')
  @ApiOperation({ summary: 'Get Enums' })
  @ApiBearerAuth()
  getEnums(): any {
    try {
      return {
        status: true,
        data: {
          loanStatus: Object.values(LoanStatus),
          department: Object.values(Department),
          role: Object.values(Role),
          callStatus: Object.values(CallStatus),
          telemarketingUserStatus: Object.values(TeleMarketerUserStatus),
          staffStatus: Object.values(StaffStatus),
          overdueCategory: Object.values(OverDueCategory),
          disbursementStatus: Object.values(DisbursementStatus),
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
}
