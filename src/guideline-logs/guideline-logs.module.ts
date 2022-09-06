import { Module } from '@nestjs/common';
import { GuidelineLogsService } from './guideline-logs.service';
import { GuidelineLog } from './guideline-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidelineLogsController } from './guideline-logs.controller';

@Module({
  controllers: [GuidelineLogsController],
  providers: [GuidelineLogsService],
  imports: [TypeOrmModule.forFeature([GuidelineLog])],
  exports: [GuidelineLogsService],
})
export class GuidelineLogsModule {
}
