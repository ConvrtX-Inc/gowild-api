import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/user.entity';
import { Status } from '../../statuses/status.entity';
import { StatusEnum } from '../../auth/status.enum';
import { Password } from '../../users/password.entity';
import * as bcrypt from 'bcryptjs';

const codistEmail = 'flutterdev@codiste.com';
const codistPassword = 'query123';

export default class CodistSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    let user = await connection
      .createQueryBuilder()
      .select('u')
      .from(User, 'u')
      .where('u.email = :email', { email: codistEmail })
      .getOne();

    if (!user) {
      user = await factory(User)()
        .map(async (user) => {
          user.status = await connection
            .createQueryBuilder()
            .select('s')
            .from(Status, 's')
            .where('s.statusName = :name', {
              name: StatusEnum.Active,
            })
            .getOne();

          user.firstName = 'Admin';
          user.lastName = 'Admin';
          user.username = 'admin';
          user.email = codistEmail;
          return user;
        })
        .create();
    }

    const password = await connection
      .createQueryBuilder()
      .select('p')
      .from(Password, 'p')
      .where('p.user.id = :user', { user: user.id })
      .andWhere('p.status = :status', { status: 'true' })
      .getOne();

    if (!password) {
      await factory(Password)()
        .map(async (p) => {
          const salt = bcrypt.genSaltSync();
          p.hashedValue = bcrypt.hashSync(codistPassword, salt);
          p.metaData = JSON.stringify({ salt });
          p.user = user;
          return p;
        })
        .create();
    }
  }
}
