import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsEnum, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { GenderEnum } from 'src/users/gender.enum';

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

  @ApiProperty({ example: 'John' })
  @Allow()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @Allow()
  lastName: string | null;

  @IsEnum(GenderEnum)
  @ApiProperty({ enum: GenderEnum, example: GenderEnum.Male, nullable: true })
  @Allow()
  gender: string | null;

  @ApiProperty({ example: '+639506703401', nullable: true })
  @Allow()
  @Transform((value: string) => value.toLowerCase().trim())
  phoneNo: string | null;
}
