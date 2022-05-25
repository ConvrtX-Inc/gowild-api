import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Status } from 'src/statuses/status.entity';
export default class CreateStatus implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select()
      .from(Status, 'Status')
      .getCount();

    if (count === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Status)
        .values([
          {
            id: 1,
            status_name: 'Cancelled',
            is_active: true,
          },
          {
            id: 2,
            status_name: 'Active',
            is_active: true,
          },
          {
            id: 3,
            status_name: 'Disabled',
            is_active: true,
          },
          {
            id: 4,
            status_name: 'Approved',
            is_active: true,
          },
          {
            id: 5,
            status_name: 'Refunded',
            is_active: true,
          },
          {
            id: 6,
            status_name: 'Rejected',
            is_active: true,
          },
          {
            id: 7,
            status_name: 'Completed',
            is_active: true,
          },
          {
            id: 8,
            status_name: 'Pending',
            is_active: true,
          },
          {
            id: 9,
            status_name: 'Inactive',
            is_active: true,
          },
        ])
        .execute();
    }
  }
}
