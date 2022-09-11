import { PartialType } from '@nestjs/swagger';
import { CreateRouteClueDto } from './create-route-clue.dto';

export class UpdateRouteClueDto extends PartialType(CreateRouteClueDto) {}
