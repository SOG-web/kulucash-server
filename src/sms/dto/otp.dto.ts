/* eslint-disable @typescript-eslint/ban-types */
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { OtpChannel, OtpTokenType } from '../enums/otp.enums';

export class SentOtpDto {
  @IsNotEmpty()
  @IsObject()
  meta_data: Object;

  @IsNotEmpty()
  @IsString()
  @IsEnum(OtpChannel)
  channel: string;

  @IsNotEmpty()
  @IsString()
  sender: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(OtpTokenType)
  token_type: string;

  @IsNotEmpty()
  @IsNumber()
  token_length: number;

  @IsNotEmpty()
  @IsNumber()
  expiration_time: number;

  @IsNotEmpty()
  @IsString()
  customer_mobile_number: string;

  @IsNotEmpty()
  @IsString()
  customer_email_address: string;
}

export class ConfirmOtpDto {
  @IsNotEmpty()
  @IsString()
  verification_reference: string;

  @IsNotEmpty()
  @IsString()
  verification_code: string;
}
