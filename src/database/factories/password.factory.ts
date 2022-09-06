import { define } from 'typeorm-seeding';
import { Password } from '../../users/password.entity';
import * as bcrypt from 'bcryptjs';

define(Password, () => {
  const salt = bcrypt.genSaltSync();
  const password = new Password();
  password.hashedValue = bcrypt.hashSync('password', salt);
  password.algorithm = 'bcrypt';
  password.status = 'true';
  password.metaData = JSON.stringify({ salt });
  return password;
});
