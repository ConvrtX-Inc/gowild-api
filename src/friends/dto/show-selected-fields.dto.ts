import {IsOptional, Validate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {IsExist} from "../../common/validators/is-exists.validator";
import {Column} from "typeorm";


export class friendSelectedFields{

    @IsOptional()
    @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'from_user_id User not Found',
    })
    @Column({ nullable: true })
    from_user_id?: string | null;

    @IsOptional()
    @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'to_user_id User not Found',
    })
    @Column({ nullable: true })
    to_user_id?: string | null;

    @IsOptional()
    @ApiProperty({ example: true })
    @Column({ type: 'boolean', nullable: true, default: 'FALSE' })
    is_accepted: boolean | null;
}