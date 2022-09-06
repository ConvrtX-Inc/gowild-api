import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as base64_arraybuffer from 'base64-arraybuffer-converter';

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
  route_name?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'byte64image' })
  @Transform((value: Buffer | null | string) => (value == null ? '' : value))
  @Column({
    name: 'route_photo',
    type: 'bytea',
    nullable: true,
  })
  route_photo?: Buffer | null | string;
  @IsOptional()
  @ApiProperty({ example: 32.4832 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    default: 0,
    nullable: true,
  })
  start_point_long?: number;
  @IsOptional()
  @ApiProperty({ example: 12.4233 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    default: 0,
    nullable: true,
  })
  start_point_lat?: number;
  @IsOptional()
  @ApiProperty({ example: 65.5234 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    default: 0,
    nullable: true,
  })
  stop_point_long?: number;
  @IsOptional()
  @ApiProperty({ example: 12.4233 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    default: 0,
    nullable: true,
  })
  stop_point_lat?: number;
  @IsOptional()
  @ApiProperty({ example: 'Firebase img url' })
  @Column({
    type: 'text',
    nullable: true,
  })
  img_url: string | null;
  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ type: 'text' })
  description?: string;

  @BeforeUpdate()
  @BeforeInsert()
  public encodeImage() {
    this.route_photo = this.route_photo
      ? base64_arraybuffer.base64_2_ab(this.route_photo)
      : '';
  }

  @AfterLoad()
  public async decodeImage() {
    try {
      if (typeof this.route_photo !== null && this.route_photo != undefined) {
        this.route_photo = await base64_arraybuffer.ab_2_base64(
          new Uint8Array(base64_arraybuffer.base64_2_ab(this.route_photo)),
        );
      }
    } catch (e) {
    }
  }
}
