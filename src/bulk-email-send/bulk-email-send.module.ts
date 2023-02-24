import { Module } from '@nestjs/common';
import { bulkEmailSendService } from './bulk-email-send-service';
import { bulkEmailSendController } from './bulk-email-send-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bulkEmailSend } from './entities/bulk-email-send-entity';

@Module({
  controllers: [bulkEmailSendController],
  providers: [bulkEmailSendService],
  imports: [TypeOrmModule.forFeature([bulkEmailSend])],
})
export class bulkEmailSendModule {}
