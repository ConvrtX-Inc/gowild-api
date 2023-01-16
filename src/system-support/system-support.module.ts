import { Module } from '@nestjs/common';
import { SystemSupportController } from './system-support.controller';
import { SystemSupportService } from './system-support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSupport } from './system-support.entity';
import { SupportGateway } from './support.gateway';
import { TicketModule } from '../ticket/ticket.module';
import { TicketMessagesModule } from '../ticket-messages/ticket-messages.module';

@Module({
  controllers: [SystemSupportController],
  providers: [SystemSupportService, SupportGateway],
  exports: [SystemSupportService],
  imports: [
    TypeOrmModule.forFeature([SystemSupport]),
    TicketModule,
    TicketMessagesModule,
  ],
})
export class SystemSupportModule {}
