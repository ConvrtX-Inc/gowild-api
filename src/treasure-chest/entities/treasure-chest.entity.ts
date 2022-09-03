import { ApiProperty } from "@nestjs/swagger";
import { time } from "aws-sdk/clients/frauddetector";
import { EntityHelper } from "src/utils/entity-helper";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Allow, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import * as base64_arraybuffer from "base64-arraybuffer-converter";


@Entity()
export class TreasureChest extends EntityHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsOptional()
  @ApiProperty({ example: "First On The List" })
  @Column({
    length: 50,
    nullable: false
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: "Lorem ipsum" })
  @Column({ nullable: false })
  description?: string;

  @IsOptional()
  @ApiProperty({ example: "65.5234" })
  @Column({
    type: "decimal",
    precision: 8,
    scale: 4,
    nullable: false
  })
  location_long?: number;

  @IsOptional()
  @ApiProperty({ example: "1.12378" })
  @Column({
    type: "decimal",
    precision: 8,
    scale: 4,
    nullable: false
  })
  location_lat?: number;

  @IsOptional()
  @ApiProperty({ example: "2021/12/31" })
  @Column({ nullable: false })
  eventDate: Date;

  @IsOptional()
  @ApiProperty({ example: "07:04" })
  @Column({ nullable: false })
  event_time: time;

  @IsOptional()
  @ApiProperty({ example: 200 })
  @Column({
    type: "integer",
    nullable: false
  })
  no_of_participants?: number;

  @IsOptional()
  @ApiProperty({ example: "Firebase img url" })
  @Column({
    type: "text",
    nullable: true
  })
  img_url: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: "byte64image" })
  @Transform((value: Buffer | null | string) => (value == null ? "" : value))
  @Column({
    name: "thumbnail_img",
    type: "bytea",
    nullable: true
  })
  thumbnail_img?: Buffer | null | string;

  @IsOptional()
  @ApiProperty({ example: "augmented reality" })
  @Column({ nullable: true })
  a_r?: string;

  @BeforeUpdate()
  @BeforeInsert()
  public encodeImage() {
    this.thumbnail_img = this.thumbnail_img
      ? base64_arraybuffer.base64_2_ab(this.thumbnail_img)
      : "";
  }

  @AfterLoad()
  public async decodeImage() {
    try {
      if (typeof this.thumbnail_img !== null && this.thumbnail_img != undefined) {
        this.thumbnail_img = await base64_arraybuffer.ab_2_base64(
          new Uint8Array(base64_arraybuffer.base64_2_ab(this.thumbnail_img))
        );
      }
    } catch (e) {
    }
  }

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
