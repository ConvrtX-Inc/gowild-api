import { ApiProperty } from '@nestjs/swagger';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity } from 'typeorm';

@Entity('gw_saved-routes')
export class SavedRoute extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  route_id?: string;
}
