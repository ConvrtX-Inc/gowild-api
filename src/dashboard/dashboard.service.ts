import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginLogs } from './entities/user_login_logs.entity';
import { MoreThan } from 'typeorm';


@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UsersService
    ) {}

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

  public async createUserLoginLogs(userId: string){
     // create User login logd
     const loginDate =  new Date(Date.now());
     const currentDate =  `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}`;
      const log = await UserLoginLogs.findOne({
        where:{userId: userId, loginDate: MoreThan(currentDate)}
      })
      if(log !=null){
        await UserLoginLogs.createQueryBuilder().update().set({ loginCount: () => 'login_count + 1' })
        .where('userId = :id and loginDate > :currentDate', {id: userId, currentDate:currentDate}).execute();
      }else{
        const record = new UserLoginLogs();
        record.userId = userId,
        record.loginDate= loginDate,
        record.loginCount = 1
        await UserLoginLogs.save(record);
      }
  }

}
