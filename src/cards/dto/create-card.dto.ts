import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCardDto {
  @ApiProperty({ example: 'Thrill Seekers', nullable: true })
  @Allow()
  @Column({ nullable: true, name: 'title' })
  cardTitle: string | null;

  @ApiProperty({ example: 'google, internal', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'sponsor' })
  cardSponsor: string | null;

  @ApiProperty({ example: 'urltestexample.com', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'url_link' })
  cardUrlLink: string | null;

  @ApiProperty({ example: 'string', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'description' })
  description: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  picture: string | null;
}
