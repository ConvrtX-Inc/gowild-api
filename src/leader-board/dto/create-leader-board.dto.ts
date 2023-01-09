import { ApiProperty } from "@nestjs/swagger";
import { time } from "aws-sdk/clients/frauddetector";
import { IsDate, IsUUID } from "class-validator";

export class CreateLeaderBoardDto {
    @ApiProperty({type: 'uuid', example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6' })
  @IsUUID()
  treasure_chest_id: string;

  @ApiProperty({type: 'uuid', example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: '2021/12/31' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2021/12/31' })
  @IsDate()
  endDate: Date;

//   @ApiProperty({ example: '01:04:55' })
//   @IsTime()
//   completionTime: time;
}
