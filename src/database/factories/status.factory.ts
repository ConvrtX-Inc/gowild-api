import { define } from 'typeorm-seeding';
import { Status } from '../../statuses/status.entity';

define(Status, () => {
  const status = new Status();
  status.isActive = true;
  return status;
});
