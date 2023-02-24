import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import {object} from "twilio/lib/base/serialize";

@Injectable()
export class DashboardService {
  constructor(private readonly userService: UsersService) {}

  async getUserCount() {
    return this.userService.getUserCount();
  }

  async getAllUserGraphData() {
    return this.userService.getGraphUsers();
  }

  async getUsersByCreatedDate(createdDate){
    return await this.userService.getDataByCreatedDate(createdDate);
  }

  async downloadUserData() {
    return this.userService.downloadDashboardEntities();
  }

  async convertToCsv(data) {
    const headers = Object.keys(data[0]);
    const csvData = data.map(row => headers.map(header => row[header]).join(','));
    return [headers.join(','), ...csvData].join('\n');
  }

}
