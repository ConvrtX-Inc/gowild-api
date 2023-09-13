import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import {deviceTypeEnum} from "../../auth-google/dtos/auth-google-login.dto";

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'admin@convrtx.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsExist, ['UserEntity'], {
    message: 'Email does not exists!',
  })
  email: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'fcm_token' })
  @IsOptional()
  fcm_token: string;

  @ApiProperty({ example: 'android , ios' })
  @IsOptional()
  device_type: deviceTypeEnum;
}
