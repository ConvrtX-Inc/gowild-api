import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import {deviceTypeEnum} from "../../auth-google/dtos/auth-google-login.dto";

export class AuthFacebookLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  access_token: string;
  @ApiProperty({ example: 'fcm_token' })
  @IsOptional()
  fcm_token: string;

  @ApiProperty({ example: 'android , ios' })
  @IsNotEmpty()
  device_type: deviceTypeEnum;
}
