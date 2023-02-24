import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';

export class CreateLeaderBoardDto {
  @ApiProperty({
    type: 'uuid',
    example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6',
  })
  @IsNotEmpty()
  @Validate(IsExist, ['Route', 'id'], {
    message: 'Route does not Exist!',
  })
  @IsUUID()
  route_id: string;

  @ApiProperty({ example: '2023-01-09T11:33:36.404Z' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-01-09T12:33:36.404Z' })
  @IsNotEmpty()
  endDate: Date;
}
