import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Coordinates } from '../../common/coordinates';

export class CreateRouteDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  start: Coordinates;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  end: Coordinates;

  @ApiProperty({ type: 'number', nullable: false })
  @IsNotEmpty()
  distance_miles: number;

  @ApiProperty({ type: 'number', nullable: false })
  @IsNotEmpty()
  distance_meters: number;

  @ApiProperty({ example: '2h 14m' })
  @IsNotEmpty()
  estimate_time: string;
}
