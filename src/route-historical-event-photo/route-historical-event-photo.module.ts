import { Module } from '@nestjs/common';
import { RouteHistoricalEventPhotoService } from './route-historical-event-photo.service';
import { RouteHistoricalEventPhotoController } from './route-historical-event-photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteHistoricalEventPhoto } from './entities/route-historical-event-photo.entity';

@Module({
  controllers: [RouteHistoricalEventPhotoController],
  providers: [RouteHistoricalEventPhotoService],
  imports: [TypeOrmModule.forFeature([RouteHistoricalEventPhoto])],
})
export class RouteHistoricalEventPhotoModule {}
