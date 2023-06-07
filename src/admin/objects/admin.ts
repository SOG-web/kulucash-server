import { Role } from '@prisma/client';
import { CreateAdminDto } from '../dto/admin.dto';

export const createAdminObj: CreateAdminDto = {
  phone_number: '',
  email: '',
  first_name: '',
  last_name: '',
  role: Role.ADMIN,
  password: '',
};
