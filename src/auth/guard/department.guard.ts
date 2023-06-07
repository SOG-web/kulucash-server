import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredDepartment = this.reflector.getAllAndOverride<Department[]>(
      'departments',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredDepartment) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (
      !requiredDepartment?.some((department: Department) =>
        user.department.includes(department),
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }
    return true;
  }
}
