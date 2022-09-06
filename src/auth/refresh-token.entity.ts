import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../utils/abstract-base-entity';

@Entity('gw_refresh_tokens')
export class RefreshTokenEntity extends AbstractBaseEntity {
  @Column({ name: 'refresh_token_id', nullable: false, unique: true })
  refreshTokenId: string;

  @Column({ name: 'refresh_token_hashed', nullable: false, type: 'text' })
  refreshTokenHashed: string;

  @Column({ name: 'meta_data', nullable: true, type: 'text' })
  metaData: string;

  @Column({ enum: ['used', 'unused'] })
  status: 'used' | 'unused';
}
