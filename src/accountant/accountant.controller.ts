import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountantService } from './accountant.service';
import { ApiOperation } from '@nestjs/swagger';
import { DepartmentGuard } from 'src/auth/guard/department.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Department } from '@prisma/client';
import { DepartmentRole } from 'src/auth/decorators/department.decorator';

@Controller('accountant')
@UseGuards(JwtAuthGuard, DepartmentGuard)
@DepartmentRole(Department.ACCOUNTANT)
export class AccountantController {
  constructor(private accountantService: AccountantService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get accountant dashboard' })
  async dashboard(): Promise<any> {
    return this.accountantService.getDashboardData();
  }

  @Get('disbursement')
  @ApiOperation({ summary: 'Get disbursement' })
  async disbursement(): Promise<any> {
    return this.accountantService.getDisbursement();
  }

  @Get('repayment')
  @ApiOperation({ summary: 'Get repayment' })
  async repayment(): Promise<any> {
    return this.accountantService.getRepayment();
  }
}
