import { Module } from '@nestjs/common';
import { SubAdminService } from './sub-admin.service';
import { SubAdminController } from './sub-admin.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { StatusModule } from 'src/statuses/status.module';
import { RoleModule } from 'src/roles/roles.module';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[UsersModule,StatusModule,RoleModule,TypeOrmModule.forFeature([UserEntity]) ],
  controllers: [SubAdminController],
  providers: [SubAdminService]
})
export class SubAdminModule {}
