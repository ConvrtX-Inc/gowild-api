import { AfterLoad, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';

export class EntityHelper extends BaseEntity {
  @Exclude()
  __entity?: string;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
}
