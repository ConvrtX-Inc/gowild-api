import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from '../../common/validators/is-not-exists.validator';
import { GenderEnum } from '../gender.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'username', nullable: true })
  @Transform((value: string) => value.toLowerCase().trim())
  @IsOptional()
  username: string;

  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  @Allow()
  addressOne: string;

  @IsOptional()
  @ApiProperty({
    nullable: true,
  })
  @Allow()
  addressTwo: string;

  @ApiProperty({
    nullable: true,
  })
  @Allow()
  about_me: string;

  @IsOptional()
  @ApiProperty({ example: 'John', nullable: true })
  @Allow()
  firstName: string | null;

  @IsOptional()
  @ApiProperty({ example: 'Doe', nullable: true })
  @Allow()
  lastName: string | null;

  @ApiProperty({ example: '1999-12-12 11:11:11', nullable: true })
  @Allow()
  birthDate: Date;

  @ApiProperty({ example: 'Doe', nullable: true })
  @Allow()
  gender: GenderEnum;

  @ApiProperty({ example: '+923228066081', nullable: true })
  @Allow()
  phoneNo: string | null;
}
