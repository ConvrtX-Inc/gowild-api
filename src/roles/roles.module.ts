import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Module({
  providers: [RoleService],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RoleModule {}
