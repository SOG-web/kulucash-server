import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CallStatus, Department, Role } from '@prisma/client';
import { DepartmentRole } from 'src/auth/decorators/department.decorator';
import { DepartmentGuard } from 'src/auth/guard/department.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TelemarketingService } from './telemarketing.service';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('telemarketing')
@UseGuards(JwtAuthGuard, DepartmentGuard)
@DepartmentRole(Department.TELEMARKETER)
@ApiBearerAuth()
export class TelemarketingController {
  constructor(private telemartingService: TelemarketingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get telemarketing dashboard' })
  async dashboard(@Req() req: Request): Promise<any> {
    const { role, userId } = req.user as any;
    return this.telemartingService.dashboard(role, userId);
  }

  @Roles(Role.TEAMLEADER)
  @Get('staff-list')
  @ApiOperation({ summary: 'Get telemarketing staff list' })
  async staffList(): Promise<any> {
    return this.telemartingService.getstaffList();
  }

  @Get('get-clients')
  @ApiOperation({ summary: 'Get telemarketing clients' })
  async getClients(@Req() req: Request): Promise<any> {
    const { role, userId } = req.user as any;
    return this.telemartingService.getClients(role, userId);
  }

  @Roles(Role.TEAMLEADER)
  @Get('assign-client')
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
    @Body() data: { handler_id: string; userIds: string[] },
  ): Promise<any> {
    return this.telemartingService.assignClient(data.handler_id, data.userIds);
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
    const { userId } = req.user as any;

    const staffId = userId;
    return this.telemartingService.addComment(
      data.userId,
      data.comment,
      staffId,
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
    return this.telemartingService.updateProgress(data.userId, data.progress);
  }
}
