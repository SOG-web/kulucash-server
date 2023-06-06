import { Department, Role } from '@prisma/client';
import { CreateStaffDto, UpdateStaffDto } from '../dto/staff.dto';

export const createStaffObj: CreateStaffDto = {
  phone_number: '',
  email: '',
  first_name: '',
  last_name: '',
  department: Department.CUSTOMERSERVICE,
  role: Role.TEAMMEMBER,
};

export const updateStaffObj: UpdateStaffDto = {
  id: '',
  phone_number: '',
  email: '',
  first_name: '',
  last_name: '',
  department: Department.CUSTOMERSERVICE,
  role: Role.TEAMMEMBER,
};
