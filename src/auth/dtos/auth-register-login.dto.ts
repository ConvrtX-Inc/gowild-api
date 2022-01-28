import { ApiProperty } from '@nestjs/swagger';
import {Allow, IsEmail, IsNotEmpty, IsOptional, MinLength, Validate} from 'class-validator';
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
  @Allow()
  full_name: string | null;

  @ApiProperty({ example: 'address_line1' })
  @Allow()
  address_line1: string | null;

  @ApiProperty({ example: 'address_line2' })
  @Allow()
  address_line2: string | null;

  @ApiProperty({ example: '+639506703401' })
  @Allow()
  @Transform((value: string) => value.toLowerCase().trim())
  phone_no: string | null;
}
