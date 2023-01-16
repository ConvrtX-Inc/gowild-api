import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSubAdminDto } from './create-sub-admin.dto';
import { Allow, IsEmail, IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from '../../common/validators/is-not-exists.validator';

export class UpdateSubAdminDto extends PartialType(CreateSubAdminDto) {
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform((value: string) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })
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

  @ApiProperty({
    nullable: true,
  })
  @Allow()
  addressTwo: string;

  @ApiProperty({ example: 'John', nullable: true })
  @Allow()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', nullable: true })
  @Allow()
  lastName: string | null;
}
