import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Status } from '../../statuses/status.entity';
import { statusEnumsNames } from '../../auth/status.enum';

export default class StatusesSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select('s')
      .from(Status, 's')
      .getCount();
    if (count !== 0) {
      return;
    }

    for (const name of statusEnumsNames) {
      await factory(Status)()
        .map(async (s) => {
          s.statusName = name;
          return s;
        })
        .create();
    }
  }
}
