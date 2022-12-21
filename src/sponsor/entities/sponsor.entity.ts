import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { AfterLoad, AfterUpdate, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';
import appConfig from "../../config/app.config";
import { Transform } from 'class-transformer';
import * as base64_arraybuffer from 'base64-arraybuffer-converter';

@Entity('gw_sponsors')
export class Sponsor extends AbstractBaseEntity {
  @ApiProperty({ example: 'beff5885-a523-4cb3-8ea6-410caace6795' })
  @Validate(IsExist, ['TreasureChest', 'id'], {
    message: 'Treasure Chest Id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  treasure_chest?: string;

  @IsOptional()
  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  img_url: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'image' })
  // @Transform((value: string | null) => (value == null ? '' : value))
  @Column({ nullable: true })
  img?: string;

  @IsOptional()
  @ApiProperty({ example: 'www.redbull.com' })
  @Column({
    type: 'text',
    nullable: false,
    default: 'link',
  })
  link: string | null;


  @AfterLoad()
  updatePicture() {
    if (this.img && this.img.indexOf('/') === 0) {
      this.img = appConfig().backendDomain + this.img;
    }
  }
  // @BeforeUpdate()
  // @BeforeInsert()
  // public encodeImage() {
  //   this.img = this.img ? base64_arraybuffer.base64_2_ab(this.img) : '';
  // }

  // @AfterLoad()
  // public async decodeImage() {
  //   try {
  //     if (typeof this.img !== null && this.img != undefined) {
  //       this.img = await base64_arraybuffer.ab_2_base64(
  //         new Uint8Array(base64_arraybuffer.base64_2_ab(this.img)),
  //       );
  //     }
  //   } catch (e) {}
  // }
}
