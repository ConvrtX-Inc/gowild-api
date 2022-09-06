import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Entity('gw_guideline_logs')
export class GuidelineLog extends AbstractBaseEntity {
  @ApiProperty({ example: 'd0db6de5-c0b0-450c-a56a-492ee9ed3a7b' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User Not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId?: string;

  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ nullable: true, type: 'text' })
  guideline_type?: string;
}
