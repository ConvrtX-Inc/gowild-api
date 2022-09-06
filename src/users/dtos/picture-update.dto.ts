import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class PictureUpdateDto {
  @Allow()
  @ApiProperty({ type: 'string', format: 'uuid' })
  fileId: string;
}
