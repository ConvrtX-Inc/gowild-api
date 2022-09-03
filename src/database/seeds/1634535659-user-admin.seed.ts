import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';
import { StatusEnum } from 'src/auth/status.enum';
import { Status } from '../../statuses/status.entity';
import { PasswordService } from '../../users/password/password.service';
import { Password } from '../../users/password.entity';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const countUser = await connection
      .createQueryBuilder()
      .select()
      .from(User, 'u')
      .where('u.email = :email', { email: 'admin@convrtx.com' })
      .getCount();

    if (countUser === 0) {
      const adminUser = new User();
      adminUser.firstName = 'Admin';
      adminUser.lastName = 'Admin';
      adminUser.username = 'admin';
      adminUser.email = 'admin@convrtx.com';

      const status = new Status();
      status.id = StatusEnum.Active;
      adminUser.status = status;

      const result = await connection
        .createQueryBuilder()
        .insert()
        //
        .into(User)
        .values([plainToClass(User, adminUser)])
        .execute();

      const adminId = result.identifiers[0].id as string;
      const password = await PasswordService.generatePassword(
        adminUser,
        'qwerty123',
      );
      password.user.id = adminId;

      await connection
        .createQueryBuilder()
        .insert()
        //
        .into(Password)
        .values([plainToClass(Password, password)])
        .execute();
    }
  }
}
