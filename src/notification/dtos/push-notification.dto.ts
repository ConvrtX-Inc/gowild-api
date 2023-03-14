import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';

export class pushNotificationDto {
  @ApiProperty({ nullable: false, example: 'Notification Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ nullable: false, example: 'Test Message' })
  @IsNotEmpty()
  message: string;

  // @ApiProperty({ nullable: false, example: 'test@example.com' })
  // @IsEmail()
  // @Validate(IsExist, ['UserEntity', 'email'], {
  //   message: 'Email Not Found',
  // })
  // email: string;
}
