import { Role } from '@prisma/client';
import {
  CreateAdminDto,
  CreateInterestDto,
  UpdateInterestDto,
} from '../dto/admin.dto';

export const createAdminObj: CreateAdminDto = {
  phone_number: '',
  email: '',
  first_name: '',
  last_name: '',
  role: Role.ADMIN,
  password: '',
};

export const createInterestObj: CreateInterestDto = {
  name: '',
  vat: 0,
  interest_rate: 0,
  service_charge: 0,
};

export const updateInterestObj: UpdateInterestDto = {
  id: '',
  name: '',
  vat: 0,
  interest_rate: 0,
  service_charge: 0,
  status: 'ACTIVE',
};
