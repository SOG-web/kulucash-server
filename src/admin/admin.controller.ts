import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { createStaffObj, updateStaffObj } from './objects/staff';

@Controller('admin')
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
}
