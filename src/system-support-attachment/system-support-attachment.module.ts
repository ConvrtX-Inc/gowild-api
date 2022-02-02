import { Module } from '@nestjs/common';
import { SystemSupportAttachmentController } from './system-support-attachment.controller';
import { SystemSupportAttachmentService } from './system-support-attachment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSupportAttachment } from './system-support-attachment.entity';

@Module({
  controllers: [SystemSupportAttachmentController],
  providers: [SystemSupportAttachmentService],
  imports: [TypeOrmModule.forFeature([SystemSupportAttachment])],
})
export class SystemSupportAttachmentModule {}
