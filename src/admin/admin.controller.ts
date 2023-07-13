import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { createStaffObj, updateStaffObj } from './objects/staff';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { createInterestObj, updateInterestObj } from './objects/admin';
import { CreateInterestDto, UpdateInterestDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create-staff')
  @ApiOperation({ summary: 'Create new Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: createStaffObj,
    },
  })
  createStaff(@Body() staff: CreateStaffDto): Promise<any> {
    return this.adminService.createStaff(staff);
  }

  @Post('update-staff')
  @ApiOperation({ summary: 'Update Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: updateStaffObj,
    },
  })
  updateStaff(@Body() staff: UpdateStaffDto): Promise<any> {
    return this.adminService.editStaff(staff);
  }

  @Get('get-staff')
  @ApiOperation({ summary: 'Get Staff' })
  getStaff(): Promise<any> {
    return this.adminService.getStaffs();
  }

  @Post('delete-staff')
  @ApiOperation({ summary: 'Delete Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        id: 'id',
      },
    },
  })
  deleteStaff(@Body() staff: { id: string }): Promise<any> {
    return this.adminService.deleteStaff(staff.id);
  }

  @Post('lock-staff')
  @ApiOperation({ summary: 'Lock Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        id: 'id',
        lock: true,
      },
    },
  })
  lockStaff(@Body() staff: { id: string; lock: boolean }): Promise<any> {
    return this.adminService.lockStaff(staff.id, staff.lock);
  }

  @Post('unlock-staff')
  @ApiOperation({ summary: 'Unlock Staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        id: 'id',
        lock: false,
      },
    },
  })
  unlockStaff(@Body() staff: { id: string; lock: boolean }): Promise<any> {
    return this.adminService.lockStaff(staff.id, staff.lock);
  }

  // lock many staffs
  @Post('lock-staffs')
  @ApiOperation({ summary: 'Lock Staffs' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        ids: ['id1', 'id2'],
        lock: true,
      },
    },
  })
  lockManyStaffs(
    @Body() staffs: { ids: string[]; lock: boolean },
  ): Promise<any> {
    return this.adminService.lockManyStaffs(staffs.ids, staffs.lock);
  }

  // unlock many staffs
  @Post('unlock-staffs')
  @ApiOperation({ summary: 'Unlock Staffs' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        ids: ['id1', 'id2'],
        lock: false,
      },
    },
  })
  unlockManyStaffs(
    @Body() staffs: { ids: string[]; lock: boolean },
  ): Promise<any> {
    return this.adminService.lockManyStaffs(staffs.ids, staffs.lock);
  }

  // unlock many staffs
  @Post('unlock-staffs2')
  @ApiOperation({ summary: 'Unlock Staffs' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        ids: ['id1', 'id2'],
        lock: false,
      },
    },
  })
  unlockManyStaffs2(
    @Body() staffs: { ids: string[]; lock: boolean },
  ): Promise<any> {
    return this.adminService.lockManyStaffs(staffs.ids, staffs.lock);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard Details' })
  getDashboard(): Promise<any> {
    return this.adminService.getDashboard();
  }

  @Post('create-interest')
  @ApiOperation({ summary: 'Create new Intrest' })
  @ApiBody({
    required: true,
    schema: {
      example: createInterestObj,
    },
  })
  createInterest(@Body() interest: CreateInterestDto): Promise<any> {
    return this.adminService.createInterest(interest);
  }

  @Get('get-interests')
  @ApiOperation({ summary: 'Get Intrest' })
  getIntrest(): Promise<any> {
    return this.adminService.getInterests();
  }

  @Post('delete-interest')
  @ApiOperation({ summary: 'Delete Intrest' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        id: 'id',
      },
    },
  })
  deleteIntrest(@Body() interest: { id: string }): Promise<any> {
    return this.adminService.deleteInterest(interest.id);
  }

  @Post('update-interest')
  @ApiOperation({ summary: 'Update Intrest' })
  @ApiBody({
    required: true,
    schema: {
      example: updateInterestObj,
    },
  })
  updateIntrest(@Body() interest: UpdateInterestDto): Promise<any> {
    return this.adminService.editInterest(interest);
  }

  @Post('delete-interests')
  @ApiOperation({ summary: 'Delete Intrests' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        ids: ['id1', 'id2'],
      },
    },
  })
  deleteIntrests(@Body() interests: { ids: string[] }): Promise<any> {
    return this.adminService.deleteManyInterests(interests.ids);
  }
}
