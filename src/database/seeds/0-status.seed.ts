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
            statusName: 'Cancelled',
            is_active: true,
          },
          {
            id: 2,
            statusName: 'Active',
            is_active: true,
          },
          {
            id: 3,
            statusName: 'Disabled',
            is_active: true,
          },
          {
            id: 4,
            statusName: 'Approved',
            is_active: true,
          },
          {
            id: 5,
            statusName: 'Refunded',
            is_active: true,
          },
          {
            id: 6,
            statusName: 'Rejected',
            is_active: true,
          },
          {
            id: 7,
            statusName: 'Completed',
            is_active: true,
          },
          {
            id: 8,
            statusName: 'Pending',
            is_active: true,
          },
          {
            id: 9,
            statusName: 'Inactive',
            is_active: true,
          },
        ])
        .execute();
    }
  }
}
