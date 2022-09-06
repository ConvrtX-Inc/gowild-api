import { AfterInsert, AfterLoad, Column, Entity } from 'typeorm';
import { Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';

import appConfig from '../config/app.config';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'gw_files' })
export class FileEntity extends AbstractBaseEntity {
  @ApiProperty()
  @Allow()
  @Column()
  path: string;

  @ApiProperty()
  @Column()
  size: number;

  @ApiProperty()
  @Allow()
  @Column()
  mimetype: string;

  @ApiProperty({ nullable: true })
  @Allow()
  @Column({ nullable: true, name: 'file_name' })
  fileName: string;

  @ApiProperty({ type: () => FileMetaData, nullable: true })
  @Column('simple-json', { name: 'meta_data', nullable: true })
  metaData: any;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }
}

export class FileMetaData {
  encoding: string;
}
