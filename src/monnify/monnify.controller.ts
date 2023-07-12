import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MonnifyService } from './monnify.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  monnifyBankListResponse,
  monnifyVerifyBankAccountResponse,
} from './objects/response';

@Controller('monnify')
export class MonnifyController {
  constructor(private readonly monnifyService: MonnifyService) {}

  @Get('bankList')
  @ApiOperation({ summary: 'Get list of banks' })
  @ApiResponse({
    status: 200,
    description: 'Get list of banks',
    schema: {
      type: 'object',
      example: monnifyBankListResponse,
    },
  })
  async bankList() {
    return await this.monnifyService.bankList();
  }

  @Get('bankAccountVerification')
  @ApiOperation({ summary: 'Verify bank account' })
  @ApiQuery({
    schema: {
      example: {
        accountNumber: '1234567890',
        bankCode: '044',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Verify bank account',
    schema: {
      type: 'object',
      example: monnifyVerifyBankAccountResponse,
    },
  })
  async bankAccountVerification(
    @Query() details: { accountNumber: string; bankCode: string },
  ) {
    return await this.monnifyService.bankAccountVerification(
      details.accountNumber,
      details.bankCode,
    );
  }

  @Post('bvnAccountVerification')
  @ApiOperation({ summary: 'Verify bank account with bvn' })
  @ApiBody({
    schema: {
      example: {
        accountNumber: '1234567890',
        bankCode: '044',
        bvn: '12345678901',
      },
    },
  })
  @ApiResponse({})
  async bvnAccountVerification(
    @Body() details: { accountNumber: string; bankCode: string; bvn: string },
  ) {
    return await this.monnifyService.bvnAccountVerification(
      details.accountNumber,
      details.bankCode,
      details.bvn,
    );
  }
}
