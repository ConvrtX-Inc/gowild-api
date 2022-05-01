import { PartialType } from '@nestjs/swagger';
import { CreateRouteHistoricalEventPhotoDto } from './create-route-historical-event-photo.dto';

export class UpdateRouteHistoricalEventPhotoDto extends PartialType(CreateRouteHistoricalEventPhotoDto) {}
