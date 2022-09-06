import { Module } from '@nestjs/common';
import { SystemSupportController } from './system-support.controller';
import { SystemSupportService } from './system-support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSupport } from './system-support.entity';

@Module({
  controllers: [SystemSupportController],
  providers: [SystemSupportService],
  exports: [SystemSupportService],
  imports: [TypeOrmModule.forFeature([SystemSupport])],
})
export class SystemSupportModule {
}
