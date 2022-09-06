import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import * as base64_arraybuffer from 'base64-arraybuffer-converter';

@Entity('gw_system_support_attachments')
export class SystemSupportAttachment extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['SystemSupport', 'id'], {
    message: 'sys_support_id not Found',
  })
  @Column({ nullable: true })
  sys_support_id?: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'byte64image' })
  @Transform((value: Buffer | null | string) => (value == null ? '' : value))
  @Column({
    name: 'attachment',
    type: 'bytea',
    nullable: true,
  })
  attachment?: Buffer | null | string;

  @BeforeUpdate()
  @BeforeInsert()
  public encodeImage() {
    this.attachment = this.attachment
      ? base64_arraybuffer.base64_2_ab(this.attachment)
      : '';
  }

  @AfterLoad()
  public async decodeImage() {
    try {
      if (typeof this.attachment !== null && this.attachment != undefined) {
        this.attachment = await base64_arraybuffer.ab_2_base64(
          new Uint8Array(base64_arraybuffer.base64_2_ab(this.attachment)),
        );
      }
    } catch (e) {
    }
  }

}
