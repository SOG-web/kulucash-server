import { Controller, UseGuards, Get, Req, Body, Post } from '@nestjs/common';
import { CallStatus, Department, Role } from '@prisma/client';
import { Request } from 'express';
import { DepartmentRole } from 'src/auth/decorators/department.decorator';
import { DepartmentGuard } from 'src/auth/guard/department.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CommonService } from 'src/common/common.service';
import { CollectionService } from './collection.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('collection')
@UseGuards(JwtAuthGuard, DepartmentGuard)
@DepartmentRole(Department.COLLECTOR)
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private commonService: CommonService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get telemarketing dashboard' })
  async dashboard(@Req() req: Request): Promise<any> {
    const { role, id } = req.user as any;
    return this.collectionService.dashboard(role, id);
  }

  @Roles(Role.TEAMLEADER)
  @Get('staff-list')
  @ApiOperation({ summary: 'Get telemarketing staff list' })
  async staffList(): Promise<any> {
    return this.collectionService.getStaffList();
  }

  @Get('get-clients')
  @ApiOperation({ summary: 'Get telemarketing clients' })
  async getClients(@Req() req: Request): Promise<any> {
    // console.log(req.user);
    const { role, id } = req.user as any;
    return this.collectionService.getClients(role, id);
  }

  @Roles(Role.TEAMLEADER)
  @Post('assign-client')
  @ApiOperation({ summary: 'Assign client to telemarketing staff' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        handler_id: 'id',
        userIds: ['id1', 'id2'],
      },
    },
  })
  async assignClient(
    @Body() data: { handler_id: string; userIds: string[]; due_date: string },
  ): Promise<any> {
    const { handler_id } = data;
    this.commonService.assignClient(data.userIds, {
      collector_handler_id: handler_id,
      collector_call_status: CallStatus.NOTCALLED,
      collector_due_date: data.due_date,
    });
  }

  @Post('add-comment')
  @ApiOperation({ summary: 'Add comment to client' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        userId: 'id',
        comment: 'comment',
      },
    },
  })
  async addComment(
    @Req() req: Request,
    @Body() data: { userId: string; comment: string },
  ): Promise<any> {
    const { id } = req.user as any;

    const staffId = id;
    return this.commonService.addComment(
      data.userId,
      data.comment,
      staffId,
      Department.COLLECTOR,
    );
  }

  @Post('update-progress')
  @ApiOperation({ summary: 'Update client progress' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        userId: 'id',
        progress: CallStatus.CALLED,
      },
    },
  })
  async updateProgress(
    @Body() data: { userId: string; progress: CallStatus },
  ): Promise<any> {
    const status = data.progress;
    return this.commonService.updateCallProgress(data.userId, {
      collector_call_status: status,
      collector_call_time: new Date(),
      collector_call_count: {
        increment: 1,
      },
    });
  }
}
