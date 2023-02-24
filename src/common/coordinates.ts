import { ApiProperty } from '@nestjs/swagger';

export class Coordinates {
  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false,
  })
  latitude: number;

  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false,
  })
  longitude: number;
}
