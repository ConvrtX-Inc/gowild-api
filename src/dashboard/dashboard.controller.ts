import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Dashboard')
@Controller({
  path: 'dashboard',
  version: '1',
})
export class DashboardController {
  constructor(public service: DashboardService) {}

  @ApiOperation({
    summary: 'Retrieve Total users, active users, Inactive Users',
  })
  @Get('users-info')
  getUserCount() {
    return this.service.getUserCount();
  }
}
