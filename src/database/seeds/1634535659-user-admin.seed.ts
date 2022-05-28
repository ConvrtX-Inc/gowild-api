import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';
import { StatusEnum } from 'src/auth/status.enum';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const countUser = await connection
      .createQueryBuilder()
      .select()
      .from(User, 'User')
      .where('"User"."email" = :email', { email: 'admin@convrtx.com' })
      .getCount();

    if (countUser === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          plainToClass(User, {
            full_name: 'Admin',
            username: 'admin',
            email: 'admin@convrtx.com',
            password: 'qwerty123',
            status_id: StatusEnum.Active
          }),
        ])
        .execute();
    }
  }
}
