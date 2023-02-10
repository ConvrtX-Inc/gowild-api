import {Controller, Get, Res} from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {Query, UseGuards} from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {NotFoundException} from "../exceptions/not-found.exception";
import {AdminRolesGuard} from "../roles/admin.roles.guard";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
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

  @ApiOperation({ summary: 'Retrieve all Users' })
  @Get('users')
  async getAllUsers() {
   return{ data: await this.service.getAllUserGraphData() }
  }

  @ApiOperation({ summary: 'Download CSV file' })
  @Get('csv')
  async downloadCsv(@Res() res, @Query('created_date') createdDate) {
    let data;
    if (createdDate) {
      data = await this.service.getUsersByCreatedDate(createdDate);
      if (!data.length) {
        throw new NotFoundException({ message: 'No users found with provided created date' })
      }
    } else {
      data = await this.service.downloadUserData();
    }
      const csv =  await this.service.convertToCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
      res.send(csv);
  }
}
