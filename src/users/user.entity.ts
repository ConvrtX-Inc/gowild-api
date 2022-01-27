import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import {Exclude, Transform} from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { CrudValidationGroups } from '@nestjsx/crud';
import * as base64_arraybuffer from 'base64-arraybuffer-converter';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'username' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['User'], {
    message: 'username already exists',
    groups: [CrudValidationGroups.CREATE],
  })
  @IsEmail()
  @Column({ unique: true, nullable: true })
  username: string | null;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
    groups: [CrudValidationGroups.CREATE],
  })
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email: string | null;

  @ApiProperty()
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @MinLength(6, {
    groups: [CrudValidationGroups.CREATE],
  })
  @Column({ nullable: true })
  password: string;

  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @ApiProperty({ example: '+639506703401' })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Index()
  @Column({ nullable: true })
  phone_no: string | null;


  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'byte64image' })
  @Transform((value: Buffer | null | string) => (value == null ? '' : value))
  @Column({
    name: 'profile_photo',
    type: 'bytea',
    nullable: true,
  })
  profile_photo?: Buffer | null | string;

  @BeforeUpdate()
  @BeforeInsert()
  public encodeImage() {
    this.profile_photo = this.profile_photo
      ? base64_arraybuffer.base64_2_ab(this.profile_photo)
      : '';
  }

  @AfterLoad()
  public async decodeImage() {
    try {
      if (typeof this.profile_photo !== null && this.profile_photo != undefined) {
        this.profile_photo = await base64_arraybuffer.ab_2_base64(
          new Uint8Array(base64_arraybuffer.base64_2_ab(this.profile_photo)),
        );
      }
    } catch (e) {}
  }

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @Index()
  hash: string | null;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
