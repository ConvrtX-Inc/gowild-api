import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSubAdminDto{
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform((value: string) => value.toLowerCase().trim())
 /* @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })*/
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({ example: 'username', nullable: true })
  @Allow()
  username: string;
  @ApiProperty({
    nullable: true,
  })
  @Allow()
  addressOne: string;

 /* @ApiProperty({
    nullable: true,
  })
  @Allow()
  addressTwo: string;*/

  @ApiProperty({ example: 'John', nullable: true })
  @Allow()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', nullable: true })
  @Allow()
  lastName: string | null;

  @ApiProperty({ example: '1999-12-12 11:11:11', nullable: true })
  @Allow()
  birthDate: Date;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
