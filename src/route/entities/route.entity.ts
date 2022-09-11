import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { FileEntity } from '../../files/file.entity';
import { IsExist } from '../../common/validators/is-exists.validator';

@Entity('gw_routes')
export class Route extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'First On the List' })
  @Column({
    length: 50,
    nullable: true,
  })
  title?: string;

  @Allow()
  @ApiProperty({ type: () => AppPoint })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  startPoint?: Geometry;

  @Allow()
  @ApiProperty({ type: () => AppPoint })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  endPoint?: Geometry;

  @Allow()
  @ApiProperty({ nullable: true, type: () => FileEntity })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'picture_id' })
  picture: FileEntity;

  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ type: 'text' })
  description?: string;
}
