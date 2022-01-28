import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './status.entity';

@Module({
  controllers: [StatusController],
  providers: [StatusService],
  imports: [TypeOrmModule.forFeature([Status])],
})
export class StatusModule {}
