import { Module } from '@nestjs/common';
import { GuidelineLogsService } from './guideline-logs.service';
import { GuidelineLog } from './guideline-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [GuidelineLogsService],
  imports: [TypeOrmModule.forFeature([GuidelineLog])],
  exports: [GuidelineLogsService],
})
export class GuidelineLogsModule {}
