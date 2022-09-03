import { Module } from '@nestjs/common';
import { User } from './user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';
import { PasswordService } from './password/password.service';
import { StatusModule } from '../statuses/status.module';
import { Password } from './password';

@Module({
  imports: [StatusModule, TypeOrmModule.forFeature([User, Password])],
  controllers: [UsersController],
  providers: [UsersService, MailService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {
}
