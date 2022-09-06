import { define } from 'typeorm-seeding';
import { User } from '../../users/user.entity';
import { faker } from '@faker-js/faker';

define(User, () => {
  const gender = faker.name.sex() as any;
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.birthDate = faker.date.birthdate();
  user.gender = gender;
  user.username = `${firstName}${lastName}${faker.random.alphaNumeric()}`;
  user.email = faker.internet.email();
  user.phoneNo = faker.phone.number();
  return user;
});
