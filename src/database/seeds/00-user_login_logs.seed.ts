import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from 'typeorm';
import { UserEntity } from "src/users/user.entity";
import { UserLoginLogs } from "src/dashboard/entities/user_login_logs.entity";


export default class UserLoginLogsSeeder implements Seeder{
  public async run(factory: Factory, connection: Connection): Promise<void> {

    
    const [users, count] = await UserEntity.findAndCount({ take: 100 });

    if (count !== 0) {
      const loginLogs = [];
    
      for (let i = 0; i < users.length; i++) {
          loginLogs.push({
            userId: users[i]?.id,
            loginDate: await this?.getRandomDateLast30Days(),
            loginCount: 1,
          });
       
      }
    
      await UserLoginLogs.save(UserLoginLogs.create(loginLogs));
    }
    
    
   
    

}
async getRandomDateLast30Days() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
  const randomTimestamp = Math.floor(Math.random() * (today.getTime() - firstDayOfMonth.getTime())) + firstDayOfMonth.getTime();
  const randomDate = new Date();
  randomDate.setTime(randomTimestamp);
  return randomDate;
}



}