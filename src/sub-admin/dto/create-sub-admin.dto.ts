import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsEnum, IsOptional, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/common/validators/is-not-exists.validator';
import {Exclude, Transform} from 'class-transformer';
import { GenderEnum } from 'src/users/gender.enum';
import {Column} from "typeorm";

export class CreateSubAdminDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'Email already Exists! Please try another one.',
  })
  @IsEmail()
  email: string;



  @ApiProperty({ example: 'John' })
  @Allow()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @Allow()
  lastName: string | null;

  @ApiProperty({ example: 'string2321' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'Username already Exists! Please try another one.',
  })
  username: string | null;

  @IsEnum(GenderEnum)
  @ApiProperty({
    enum: GenderEnum,
    example: GenderEnum.Male,
    nullable: true,
    enumName: 'GenderEnum',
  })
  @IsOptional()
  @Allow()
  gender: GenderEnum.Male;

  @ApiProperty({ example: '+639506703401', nullable: true })
  @Allow()
  @Transform((value: string) => value.toLowerCase().trim())
  phoneNo: string | null;

  @ApiProperty({
    nullable: true
  })
  @Allow()
  addressOne: string;

  @ApiProperty({
    nullable: true
  })
 /* @Allow()
  @Exclude()
  addressTwo: string;*/

  @IsOptional()
  @ApiProperty({ example: '1999-12-12 11:11:11', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  birthDate?: Date;
}

