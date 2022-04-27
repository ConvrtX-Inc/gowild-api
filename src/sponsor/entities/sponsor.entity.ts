import { EntityHelper } from "src/utils/entity-helper";
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsOptional, Validate } from "class-validator";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Transform } from "class-transformer";
import * as base64_arraybuffer from 'base64-arraybuffer-converter';

@Entity()
export class Sponsor extends EntityHelper{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'beff5885-a523-4cb3-8ea6-410caace6795' })
    @Validate(IsExist, ['TreasureChest', 'id'], {
        message: 'Treasure Chest Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    treasure_chest_id?: string;

    @Allow()
    @IsOptional()
    @ApiProperty({ example: 'byte64image' })
    @Transform((value: Buffer | null | string) => (value  == null ? '' : value))
    @Column({
        name: 'img',
        type: 'bytea',
        nullable: true,
    })
    img?: Buffer | null | string;

    @BeforeUpdate()
    @BeforeInsert()
    public encodeImage() {
        this.img = this.img
        ? base64_arraybuffer.base64_2_ab(this.img)
        : '';
    }

    @AfterLoad()
    public async decodeImage() {
        try{
            if(typeof this.img !== null && this.img != undefined){
                this.img = await base64_arraybuffer.ab_2_base64(
                    new Uint8Array(base64_arraybuffer.base64_2_ab(this.img)),
                );
            }
        } catch (e){}
    }

    @IsOptional()
    @ApiProperty({ example: 'www.redbull.com'})
    @Column ({ 
        type: 'text',
        nullable: false,
        default: 'link'
    })
    link: string | null;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;
}
