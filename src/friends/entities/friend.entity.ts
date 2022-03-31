import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Allow, Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Friends extends EntityHelper {
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

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
      message: 'User not Found',
    })
    @Column({ 
      type: "uuid",
      nullable: false 
    })
    friend_id?: string;

    @Allow()
    @ApiProperty({ example: false})
    @Column({ 
        type: 'boolean',
        nullable: false,
    })
    is_approved?: boolean;

    @CreateDateColumn()
    created_date: Date;
  
    @UpdateDateColumn()
    updated_date: Date;
}
