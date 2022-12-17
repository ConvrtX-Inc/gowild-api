import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Transform } from 'class-transformer';

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
}
