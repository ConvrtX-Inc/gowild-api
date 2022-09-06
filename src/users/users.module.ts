import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';
import { PasswordService } from './password.service';
import { StatusModule } from '../statuses/status.module';
import { Password } from './password.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [StatusModule, TypeOrmModule.forFeature([User, Password]), FilesModule],
  controllers: [UsersController],
  providers: [UsersService, MailService, PasswordService],
  exports: [UsersService, PasswordService],
})
export class UsersModule {
}
