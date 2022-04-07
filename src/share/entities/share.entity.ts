import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Share extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'd0db6de5-c0b0-450c-a56a-492ee9ed3a7b'})
    @Validate(IsExist, ['User', 'id'], {
        message: 'User Not Found',
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

    @IsOptional()
    @ApiProperty({ example: 'www.gowild.com'})
    @Column({ 
        type: 'text',
        nullable: true, 
        default: 'www.gowild.com'
    })
    url: string | null;

    @CreateDateColumn()
    created_date: Date;
  
    @UpdateDateColumn()
    updated_date: Date;
}
