import { ApiProperty } from '@nestjs/swagger';

export class AppPoint {
  @ApiProperty({ type: () => AppPoint })
  type: 'Point';

  @ApiProperty({ type: () => [Number] })
  coordinates: [number, number];
}
