import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';


@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
  imports: [UsersModule],
})
export class DashboardModule {}
