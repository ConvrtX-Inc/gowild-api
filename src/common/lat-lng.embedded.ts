import { ApiProperty } from '@nestjs/swagger';

export class AppPoint {
  @ApiProperty({ type: 'string', enum: ['Point'] })
  type: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
      format: 'double',
    },
  })
  coordinates: number[];
}
