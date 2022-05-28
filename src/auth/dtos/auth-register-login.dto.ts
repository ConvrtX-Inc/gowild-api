import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Column, Generated, Index } from 'typeorm';
import { StatusEnum } from '../status.enum';
import { GenderEnum } from 'src/users/gender.enum';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'full_name' })
  @Allow()
  full_name: string | null;

  @ApiProperty({ example: '' })
  @Allow()
  first_name: string | null;

  @ApiProperty({ example: '' })
  @Allow()
  last_name: string | null;

  @IsEnum(GenderEnum)
  @ApiProperty({ enum: GenderEnum, example: GenderEnum.Male })
  @Allow()
  gender: string | null;

  @ApiProperty({ example: '' })
  @Allow()
  address_line1: string | null;

  @ApiProperty({ example: '' })
  @Allow()
  address_line2: string | null;

  @ApiProperty({ example: '+639506703401' })
  @Allow()
  @Transform((value: string) => value.toLowerCase().trim())
  phone_no: string | null;

  @Allow()
  @IsEnum(StatusEnum)
  @ApiProperty({ enum: StatusEnum, example: StatusEnum.Pending })
  status_id: number;
}
 