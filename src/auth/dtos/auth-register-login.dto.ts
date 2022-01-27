import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional, MinLength, Validate} from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import {IsExist} from "../../utils/validators/is-exists.validator";
import {CrudValidationGroups} from "@nestjsx/crud";
import {Column, Index} from "typeorm";

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
  full_name: string | null;

  @ApiProperty({ example: 'address_line1' })
  address_line1: string | null;

  @ApiProperty({ example: 'address_line2' })
  address_line2: string | null;

  @ApiProperty({ example: '+639506703401' })
  @Transform((value: string) => value.toLowerCase().trim())
  phone_no: string | null;
}
