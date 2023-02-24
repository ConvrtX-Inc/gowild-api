import { ApiProperty } from '@nestjs/swagger';
import { Allow, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';

export class ConfirmDto {
  @Allow()
  @ApiProperty({
    example: 'de5c7612-19a7-4d67-8f3e-a2fae10f7af6',
    required: true,
  })
  @Validate(IsExist, ['gw_users'], {
    message: 'userDoesnotExist',
  })
  id?: string;
}
