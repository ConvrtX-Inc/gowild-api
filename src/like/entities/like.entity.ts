import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Like extends EntityHelper{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
      message: 'User not Found',
    })
    @Column({ 
      type: "uuid",
      nullable: false
    })
    user_id?: string;

    @ApiProperty({ example: '56320f5c-9236-424c-9eb2-339fa9dbb3cb' })
    @Validate(IsExist, ['PostFeed', 'id'], {
      message: 'Post Feed id not Found',
    })
    @Column({ 
      type: "uuid",
      nullable: false
    })
    postfeed_id?: string;

    @CreateDateColumn()
    created_date: Date;
  
    @UpdateDateColumn()
    updated_date: Date;
}
