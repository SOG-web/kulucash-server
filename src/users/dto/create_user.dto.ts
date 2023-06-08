import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BvnDataDto {
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsString()
  @IsNotEmpty()
  phone_number1: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  enrollment_bank: string;

  @IsString()
  @IsNotEmpty()
  enrollment_branch: string;

  @IsString()
  @IsNotEmpty()
  level_of_account: string;

  @IsString()
  @IsNotEmpty()
  lga_of_origin: string;

  @IsString()
  @IsNotEmpty()
  lga_of_residence: string;

  @IsString()
  @IsNotEmpty()
  marital_status: string;

  @IsString()
  name_on_card: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsOptional()
  @IsString()
  nin: string;

  @IsOptional()
  @IsString()
  phone_number2: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  registration_date: string;

  @IsString()
  residential_address: string;

  @IsString()
  @IsNotEmpty()
  state_of_origin: string;

  @IsString()
  @IsNotEmpty()
  state_of_residence: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  watch_listed: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  bvn: string;

  @IsString()
  @IsNotEmpty()
  education: string;

  @IsString()
  @IsNotEmpty()
  marital_status: string;

  @IsString()
  @IsNotEmpty()
  number_of_children: string;

  @IsString()
  @IsNotEmpty()
  current_address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  lga_of_origin: string;

  @IsString()
  @IsNotEmpty()
  state_of_origin: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state_of_residence: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested()
  @Type(() => BvnDataDto)
  bvn_data: BvnDataDto;
}
