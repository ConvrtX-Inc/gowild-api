import { UserLoginLogs } from "src/dashboard/entities/user_login_logs.entity";
import { define } from "typeorm-seeding";

define(UserLoginLogs, () => {
  return new UserLoginLogs();
});