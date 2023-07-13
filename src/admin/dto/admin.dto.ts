import { InterestStatus, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsEnum(Role)
  role: Role;
}

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  vat: number;

  @IsNumber()
  @IsNotEmpty()
  interest_rate: number;

  @IsNumber()
  @IsNotEmpty()
  service_charge: number;
}

export class UpdateInterestDto extends CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsEnum(InterestStatus)
  status: InterestStatus;
}
