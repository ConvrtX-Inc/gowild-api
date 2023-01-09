import { ApiProperty } from "@nestjs/swagger";
import { time } from "aws-sdk/clients/frauddetector";
import { IsNotEmpty, IsUUID, } from "class-validator";
import { IsValidTime } from "src/common/is_valid_time";

export class CreateLeaderBoardDto {
  @ApiProperty({type: 'uuid', example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6' })
  @IsNotEmpty()
  @IsUUID()
  route_id: string;

  @ApiProperty({ example: '2023-01-09T11:33:36.404Z' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-01-09T12:33:36.404Z' })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: '01:04:55' })
  @IsNotEmpty()
  @IsValidTime({ message: 'Completion time must be a valid time string (HH:mm:ss)' })
  completionTime: time;
}
