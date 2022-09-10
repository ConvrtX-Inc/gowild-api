import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/user.entity';
import { Status } from '../../statuses/status.entity';
import { StatusEnum } from '../../auth/status.enum';
import { Password } from '../../users/password.entity';

export default class FakeSeed implements Seeder {

  public async run(factory: Factory, connection: Connection): Promise<void> {
    if (process.env.SEED_FAKE_DATA !== 'true') {
      return;
    }

    const status = await connection
      .createQueryBuilder()
      .select('s')
      .from(Status, 's')
      .where('s.statusName = :name', {
        name: StatusEnum.Active,
      })
      .getOne();

    const users = await factory(User)()
      .map(async (u) => {
        u.status = status;
        return u;
      })
      .createMany(20);

    for (const user of users) {
      await factory(Password)()
        .map(async (password) => {
          password.user = user;
          return password;
        })
        .create();
    }
  }
}
