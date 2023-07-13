/**
 * Copyright 2023 ROU Technology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { SmsService } from 'src/sms/sms.service';
import { CompleteProfileUserDto } from './dto/update_profile_user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestLoanUserDto } from './dto/loan_user.dto';
import { InterestStatus, LoanStatus } from '@prisma/client';

@Injectable()
export class UsersService2 {
  constructor(
    private prisma: PrismaService,
    private readonly config: ConfigService,
    private sms: SmsService,
    private cloudinary: CloudinaryService,
  ) {}

  async completeProfile(
    id: string,
    dto: CompleteProfileUserDto,
    res: Response,
    req: Request,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new ForbiddenException({
          message: 'User not found',
          status: false,
          error: 'User not found',
        });
      }

      if (Object.keys(req.files).length < 3) {
        return res.status(403).json({
          message: `Please upload all required documents`,
          error: 'Prisma Error',
          status: false,
        });
      }

      const filesObj = ['idCard', 'profileImage'].map((key) => ({
        key,
        file: req.files[key][0],
      }));

      const [idCard, profileImage] = await Promise.all(
        filesObj.map(async ({ key, file }) => {
          const result = await this.cloudinary.uploadImage(file.path, {
            folder: `users/${id}`,
            resource_type: 'image',
            access_mode: 'public',
          });

          return {
            key,
            result,
          };
        }),
      );

      // check if there is an upload error
      if (!idCard.result || !profileImage.result) {
        throw new ForbiddenException({
          message: 'Upload error',
          status: false,
          error: 'Upload error',
        });
      }

      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          image: profileImage.result.url,
          id_card: idCard.result.url,
        },
      });

      await this.prisma.emergencyContact.create({
        data: {
          name: dto.emergency_contact_name,
          phone_number: dto.emergency_contact_name,
          relationship: dto.emergency_contact_relationship,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });

      await this.prisma.colleagueContact.create({
        data: {
          name: dto.colleague_name,
          phone_number: dto.colleague_phone_number,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });

      await this.prisma.employmentDetails.create({
        data: {
          company_address: dto.company_address,
          company_name: dto.company_name,
          employment_status: dto.employment_status,
          date_of_employment: dto.date_of_employment,
          role: dto.company_role,
          salary_range: dto.salary_range,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });

      return res.status(200).json({
        message: `Profile updated successfully`,
        status: true,
      });
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'there was an error',
        error,
      });
    }
  }

  async requestLoan(id: string, req: Request, dto: RequestLoanUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          UserProperties: true,
        },
      });

      const loan = await this.prisma.loans.create({
        data: {
          amount: dto.amount,
          amount_requested: dto.amount,
          status: LoanStatus.PENDING,
          purpose: dto.purpose,
          overDueFee: 0,
          overDueDays: 0,
          interest: {
            connect: {
              id: dto.interestId,
            },
          },
          Bank: {
            connect: {
              id: dto.bankId,
            },
          },
          Card: {
            connect: {
              id: dto.cardId,
            },
          },
          loan_request_status: LoanStatus.PENDING,
          duration: dto.duration,
          UserProperties: {
            connect: {
              id: user.UserProperties.id,
            },
          },
        },
      });

      return {
        status: true,
        data: 'Successful',
        message: 'Loan Requested Successful',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        error: error,
        message: 'Error requesting Loan',
      });
    }
  }

  async createCard(userId: string, data: any) {}

  async getCardList(userId: string) {
    try {
      const cards = await this.prisma.cardDetail.findMany({
        where: {
          userId: userId,
        },
      });

      return {
        status: true,
        data: cards,
        message: 'Card fetched Successfully',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error getting card list',
        error,
      });
    }
  }

  async getInterest() {
    try {
      const interest = await this.prisma.interest.findFirst({
        where: {
          status: InterestStatus.ACTIVE,
        },
      });

      return {
        status: true,
        data: interest,
        message: 'Interest fetched Successfully',
      };
    } catch (error) {
      throw new ForbiddenException({
        status: false,
        message: 'Error getting interest',
        error,
      });
    }
  }
}
