import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { Status } from '../../statuses/status.entity';
import { StatusEnum } from '../../auth/status.enum';
import { Password } from '../../users/password.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../roles/role.entity';
import { RoleEnum } from '../../roles/roles.enum';

function parseUserData(data: string): string[] {
  try {
    return data.split(',');
  } catch (e) {
    console.error('Cannot read this param: ' + data, e);
    throw Error('Cannot read this param: ');
  }
}

const usersToAddEmail = parseUserData(process.env.SEED_ADD_USERS_EMAIL ?? '');
const usersToAddPassword = parseUserData(
  process.env.SEED_ADD_USERS_PASSWORD ?? '',
);

export default class AdminSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    if (usersToAddEmail.length !== usersToAddPassword.length) {
      throw Error('No password provided for some users');
    }

    for (let i = 0; i < usersToAddEmail.length; i++) {
      const userEmail = usersToAddEmail[i];
      let user = await connection
        .createQueryBuilder()
        .select('u')
        .from(UserEntity, 'u')
        .where('u.email = :email', { email: userEmail })
        .getOne();

      if (!user) {
        user = await factory(UserEntity)()
          .map(async (user) => {
            user.status = await connection
              .createQueryBuilder()
              .select('s')
              .from(Status, 's')
              .where('s.statusName = :name', {
                name: StatusEnum.Active,
              })
              .getOne();
            user.role = await connection
              .createQueryBuilder()
              .select('r')
              .from(Role, 'r')
              .where('r.name = :name', {
                name: RoleEnum.SUPER_ADMIN,
              })
              .getOne();

            user.firstName = userEmail;
            user.lastName = 'Admin Family';
            user.username = userEmail;
            user.email = userEmail;
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
            p.hashedValue = bcrypt.hashSync(usersToAddPassword[i], salt);
            p.metaData = JSON.stringify({ salt });
            p.user = user;
            return p;
          })
          .create();
      }
    }
  }
}
