import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';

export class SaveRouteDto {
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['Route', 'id'], {
    message: 'Route Not Found',
  })
  route_id?: string | null;
}
