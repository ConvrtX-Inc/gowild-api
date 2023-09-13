import { ApiProperty } from '@nestjs/swagger';
import {Allow, IsNotEmpty, IsOptional} from 'class-validator';
import {deviceTypeEnum} from "../../auth-google/dtos/auth-google-login.dto";

export class AuthAppleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  idToken: string;

  @Allow()
  @ApiProperty({ required: false })
  firstName?: string;

  @Allow()
  @ApiProperty({ required: false })
  lastName?: string;
  @ApiProperty({ example: 'fcm_token' })
  @IsOptional()
  fcm_token: string;

  @ApiProperty({ example: 'android , ios' })
  @IsNotEmpty()
  device_type: deviceTypeEnum;
}
