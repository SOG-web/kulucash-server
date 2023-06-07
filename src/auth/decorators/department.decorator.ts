import { SetMetadata } from '@nestjs/common';
import { Department } from '@prisma/client';

export const DEPARTMENT_KEY = 'departments';
export const Departments = (...departments: Department[]) =>
  SetMetadata(DEPARTMENT_KEY, departments);
