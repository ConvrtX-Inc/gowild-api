import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsEnum, IsOptional, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/common/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { GenderEnum } from 'src/users/gender.enum';

export class CreateSubAdminDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;



  @ApiProperty({ example: 'John' })
  @Allow()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @Allow()
  lastName: string | null;

  @IsEnum(GenderEnum)
  @ApiProperty({
    enum: GenderEnum,
    example: GenderEnum.Male,
    nullable: true,
    enumName: 'GenderEnum',
  })
  @IsOptional()
  @Allow()
  gender: GenderEnum;

  @ApiProperty({ example: '+639506703401', nullable: true })
  @Allow()
  @Transform((value: string) => value.toLowerCase().trim())
  phoneNo: string | null;

  @ApiProperty({
    nullable: true
  })
  @Allow()
  addressOne: string;

  @ApiProperty({
    nullable: true
  })
  @Allow()
  addressTwo: string;
}