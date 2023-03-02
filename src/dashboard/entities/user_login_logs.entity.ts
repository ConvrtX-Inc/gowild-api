import { AbstractBaseEntity } from "src/common/abstract-base-entity";
import { Column, Entity } from "typeorm";

@Entity('gw_user_login_logs')
export class UserLoginLogs extends AbstractBaseEntity {
    @Column({ nullable: true, name: 'login_date' })
    loginDate:  Date;

    @Column({name: 'user_id', type: 'uuid'})
    userId: string;

    @Column({ nullable: true, name: 'login_count' })
    loginCount:  number;
    
   

}