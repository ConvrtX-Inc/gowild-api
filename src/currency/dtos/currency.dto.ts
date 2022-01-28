import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { FileEntity } from '../../files/file.entity';

export class CurrencyDto {
  @ApiProperty({ example: 1 })
  id: number;

  @Allow()
  @ApiProperty({ example: 'name' })
  name: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  @Allow()
  @ApiProperty({ example: 'Description' })
  description?: string;
}
