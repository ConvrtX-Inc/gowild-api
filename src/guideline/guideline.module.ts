import { Module } from '@nestjs/common';
import { GuidelineService } from './guideline.service';
import { GuidelinesController } from './guideline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guideline } from './guideline.entity';

@Module({
  controllers: [GuidelinesController],
  providers: [GuidelineService],
  imports: [TypeOrmModule.forFeature([Guideline])],
})
export class GuidelinesModule {}
