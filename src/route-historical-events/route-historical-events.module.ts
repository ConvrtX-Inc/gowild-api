import { Module } from '@nestjs/common';
import { RouteHistoricalEventsService } from './route-historical-events.service';
import { RouteHistoricalEventsController } from './route-historical-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [RouteHistoricalEventsController],
  providers: [RouteHistoricalEventsService],
  imports: [TypeOrmModule.forFeature([RouteHistoricalEvent]), FilesModule],
})
export class RouteHistoricalEventsModule {}
