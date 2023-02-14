import { Module } from '@nestjs/common';
import { SystemSupportController } from './system-support.controller';
import { SystemSupportService } from './system-support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSupport } from './system-support.entity';
import { SupportGateway } from './support.gateway';
import { TicketModule } from '../ticket/ticket.module';
import { TicketMessagesModule } from '../ticket-messages/ticket-messages.module';
import { SystemSupportAttachmentService } from 'src/system-support-attachment/system-support-attachment.service';
import { SystemSupportAttachment } from 'src/system-support-attachment/system-support-attachment.entity';

@Module({
  controllers: [SystemSupportController],
  providers: [SystemSupportService, SupportGateway,SystemSupportAttachmentService],
  exports: [SystemSupportService],
  imports: [
    TypeOrmModule.forFeature([SystemSupport,SystemSupportAttachment]),
    TicketModule,
    TicketMessagesModule,
  ],
})
export class SystemSupportModule {}
