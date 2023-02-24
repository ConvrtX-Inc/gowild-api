import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../common/abstract-base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { Status } from '../../statuses/status.entity';

@Entity('gw_cards')
export class Card extends AbstractBaseEntity {
  @ApiProperty({ example: 'Thrill Seekers', nullable: true })
  @IsOptional()
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

  @ApiProperty({ nullable: true })
  @ManyToOne(() => Status, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: 'status_id' })
  status: Status;
}
