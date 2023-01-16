import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum deviceTypeEnum {
  ANDROID = 'android',
  IOS = 'ios',
}

export class AuthGoogleLoginDto {
  @ApiProperty({ example: 'android , ios' })
  @IsNotEmpty()
  device_type: deviceTypeEnum;

  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  id_token: string;
}
