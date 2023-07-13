import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  Res,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  BankListResponse,
  bankListResponse,
  createBankAccount,
} from './objects/bank';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CompleteProfileUserDto } from './dto/update_profile_user.dto';
import { CompleteUserProfileStrategy } from 'src/cloudinary/utils/file.strategy';
import { UsersService2 } from './users.2.service';
import { RequestLoanUserDto } from './dto/loan_user.dto';
import { createBankAccountDto } from './dto/bank.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private userService: UsersService,
    private userService2: UsersService2,
  ) {}

  @Get('get-user-profile')
  @ApiOperation({ summary: 'Get User Profile' })
  getProfile(@Req() req: Request): Promise<any> {
    const id = req.user['id'];
    return this.userService.getProlfile(id);
  }

  @Post('complete-user-profile')
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiBody({
    schema: {
      type: 'object',
      // convert UpdateProfileUserDto to properties
      example: CompleteProfileUserDto,
    },
  })
  @UseInterceptors(CompleteUserProfileStrategy)
  completeProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Req() dto: CompleteProfileUserDto,
  ): Promise<any> {
    const id = req.user['id'];
    return this.userService2.completeProfile(id, dto, res, req);
  }

  @Get('get-user-banks')
  @ApiOperation({ summary: 'Get Banks' })
  getBanks(@Req() req: Request): Promise<any> {
    const id = req.user['id'];
    return this.userService.getBankAccounts(id);
  }

  @Get('get-user-cards')
  @ApiOperation({ summary: 'Get Card list' })
  getCards(@Req() req: Request) {
    const id = req.user['id'];

    return this.userService2.getCardList(id);
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

  @Post('request-loan')
  @ApiOperation({ summary: 'Submit loan request' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        amount: 1000,
        duration: 31,
        purpose: 'dgdg',
        bankId: 'sijd',
        cardId: 'fjdd',
        interestId: 'djbjdk',
      },
    },
  })
  requestLoan(@Req() req: Request, @Body() dto: RequestLoanUserDto) {
    const id = req.user['id'];
    return this.userService2.requestLoan(id, req, dto);
  }

  @Post('create-bank-account')
  @ApiOperation({ summary: 'Creating a new bank account' })
  @ApiBody({
    required: true,
    schema: {
      example: createBankAccount,
    },
  })
  createBankAccount(@Req() req: Request, @Body() dto: createBankAccountDto) {
    const id = req.user['id'];

    return this.userService.createBankAccount(id, dto);
  }

  @Get('get-interest')
  @ApiOperation({ summary: 'Get Interest' })
  getInterest() {
    return this.userService2.getInterest();
  }
}
