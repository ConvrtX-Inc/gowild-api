import { ApiProperty } from '@nestjs/swagger';
import { time } from 'aws-sdk/clients/frauddetector';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity } from 'typeorm';

@Entity('gw_leader_board')
export class LeaderBoard extends AbstractBaseEntity {
  @ApiProperty({
    type: 'uuid',
    example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6',
  })
  @Column({ nullable: false, type: 'uuid' })
  route_id: string;

  @ApiProperty({
    type: 'uuid',
    example: '08be3c69-5783-4a4f-95b3-5ee67c38ebb6',
  })
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @ApiProperty({ example: '2021/12/31' })
  @Column({ nullable: false, name: 'start_date' })
  startDate: Date;

  @ApiProperty({ example: '2021/12/31' })
  @Column({ nullable: false, name: 'end_date' })
  endDate: Date;

  @ApiProperty({ example: '01:04:55' })
  @Column({ nullable: false, name: 'completion_time' })
  completionTime: time;

  @Column({ nullable: true, name: 'rank' })
  rank: number;
}
