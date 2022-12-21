import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, Validate, validate} from 'class-validator';
import {IsNotExist} from "../../common/validators/is-not-exists.validator";
import {UserEntity} from "../../users/user.entity";

export class AuthVerifyOTPDto { 
  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  emailPhone: string;
}

export class AuthResetPasswordDto { 

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsNotExist, [UserEntity],{
    message: "Please Enter valid Email"
  })
  emailPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

}

export class AuthResetPasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}
