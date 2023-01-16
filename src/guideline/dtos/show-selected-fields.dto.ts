import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class selectFields {
  @ApiProperty({ example: 'waiver' })
  @IsNotEmpty()
  @Column({ unique: true, nullable: true, type: 'text' })
  type?: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ example: '678036c1-9da6-43ae-bb21-253a5e9b54d5' })
  @IsNotEmpty()
  @Column({ nullable: true, type: 'uuid' })
  last_updated_user?: string; // TODO
}
