import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../roles/role.entity';
import { roleEnumsNames } from '../../roles/roles.enum';

export default class RolesSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select('r')
      .from(Role, 'r')
      .getCount();
    if (count !== 0) {
      return;
    }

    for (const name of roleEnumsNames) {
      await factory(Role)()
        .map(async (r) => {
          r.name = name;
          return r;
        })
        .create();
    }
  }
}
