import { PartialType } from '@nestjs/swagger';
import { CreateRouteHistoricalEventDto } from './create-route-historical-event.dto';

export class UpdateRouteHistoricalEventDto extends PartialType(CreateRouteHistoricalEventDto) {}
