import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitTransactionDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
  @IsString()
  @IsNotEmpty()
  packageId: string;
}

export class VerifyTransactionDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  accesscode: string;
}
