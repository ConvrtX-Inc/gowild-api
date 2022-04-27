import { PartialType } from '@nestjs/swagger';
import { CreateTreasureChestDto } from './create-treasure-chest.dto';

export class UpdateTreasureChestDto extends PartialType(CreateTreasureChestDto) {}
