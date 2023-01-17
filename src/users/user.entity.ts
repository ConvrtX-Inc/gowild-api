import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
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
import { GenderEnum } from './gender.enum';
import { Role } from '../roles/role.entity';

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
  @Column({ type: 'date', nullable: true })
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

  @ApiProperty({ example: 'About', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'About' })
  about_me: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  picture: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  frontImage: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  backImage: string | null;

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
  @Column('jsonb', { nullable: true, default: [] })
  removed_suggested_friends?: string[];

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

  @ApiProperty()
  @Column({
    nullable: true,
    name: 'phone_verified',
    default: false,
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
    return `gowild@${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // @AfterLoad()
  // @AfterUpdate()
  // updatePicture() {
  //   if (this.picture && this.picture.indexOf('/') === 0) {
  //     this.picture = appConfig().backendDomain + this.picture;
  //   }
  // }
  // @AfterLoad()
  // @AfterUpdate()
  // updateFrontImage() {
  //   if (this.frontImage && this.frontImage.indexOf('/') === 0) {
  //     this.frontImage = appConfig().backendDomain + this.frontImage;
  //   }
  // }
  // @AfterLoad()
  // @AfterUpdate()
  // updateBackImage() {
  //   if (this.backImage && this.backImage.indexOf('/') === 0) {
  //     this.backImage = appConfig().backendDomain + this.backImage;
  //   }
  // }
}
