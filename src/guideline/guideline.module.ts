import { Module } from '@nestjs/common';
import { GuidelineService } from './guideline.service';
import { GuidelinesController } from './guideline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guideline } from './guideline.entity';
import { GuidelineLogsModule } from 'src/guideline-logs/guideline-logs.module';

@Module({
  controllers: [GuidelinesController],
  providers: [GuidelineService],
  imports: [GuidelineLogsModule, TypeOrmModule.forFeature([Guideline])],
})
export class GuidelinesModule {}
