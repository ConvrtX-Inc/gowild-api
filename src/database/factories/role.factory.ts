import { define } from 'typeorm-seeding';
import {Role} from "../../roles/role.entity";

define(Role, () => {
  return new Role();
});
