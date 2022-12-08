import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {DashboardController} from "./dashboard.controller";
import {UsersModule} from "../users/users.module"

@Module({
  controllers:[DashboardController],
  providers: [DashboardService,UsersModule],
  exports: [DashboardService],
  imports: [ UsersModule ]
})
export class DashboardModule {}
