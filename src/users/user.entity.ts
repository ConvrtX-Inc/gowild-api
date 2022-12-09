import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../common/validators/is-not-exists.validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Status } from 'src/statuses/status.entity';
import { Password } from './password.entity';
import { FileEntity } from '../files/file.entity';
import { GenderEnum } from './gender.enum';
import {Role} from "../roles/role.entity";

@Entity('gw_users')
export class UserEntity extends AbstractBaseEntity {
  @ApiProperty({ example: 'John', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'first_name' })
  firstName: string | null;

  @ApiProperty({ example: 'Doe', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'last_name' })
  lastName: string | null;

  @IsOptional()
  @ApiProperty({ example: '1999-12-12 11:11:11', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  birthDate?: Date;

  @ApiProperty({
    example: GenderEnum.Male,
    nullable: true,
    enum: GenderEnum,
    enumName: 'GenderEnum',
  })
  @IsOptional()
  @Column({ nullable: true, enum: GenderEnum, enumName: 'GenderEnum' })
  gender?: GenderEnum;

  @Allow()
  @ApiProperty({ example: 'username', nullable: true })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'username already exists',
    groups: [CrudValidationGroups.CREATE],
  })
  @Column({ unique: true, nullable: true })
  username: string | null;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
    groups: [CrudValidationGroups.CREATE],
  })
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email: string | null;

  @Allow()
  @ApiProperty({ example: '+639506703401', nullable: true })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Column({ nullable: true })
  phoneNo: string | null;

  @ApiProperty({ example: 'USA', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'address_one' })
  addressOne: string | null;

  @ApiProperty({ example: 'USA', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'address_two' })
  addressTwo: string | null;

  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'picture_id' })
  picture: FileEntity;

  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'front_image_id' })
  frontImage: FileEntity;

  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'back_image_id' })
  backImage: FileEntity;

  @ApiProperty({ nullable: true })
  @ManyToOne(() => Status, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @ApiProperty({ nullable: true })
  @ManyToOne(() => Role, { nullable: false, cascade: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  hash: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  otp: string;


  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
    name: 'phone_verified',
    default: false
  })
  phoneVerified: boolean;

  @ApiHideProperty()
  @OneToMany(() => Password, (p) => p.user, { cascade: ['remove'] })
  @Exclude()
  passwords: Password[];

  @Exclude()
  get fullName(): string {
    return (
      `${this.firstName ?? ''}${this.lastName ?? ''}`.trim() ?? this.username
    );
  }

  @Exclude()
  get getTemporaryPassword(): string {
    return (
      `gowild@${Math.floor(1000 + Math.random() * 9000)}`
    );
  }
}
