import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bulkMailService } from './bulkemail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nService } from 'nestjs-i18n';
import { PostFeedAttachmentService } from 'src/post-feed-attchment/post-feed-attachment.service';
import { PostFeedAttachment } from 'src/post-feed-attchment/post-feed-attachment.entity';

@Module({
    //   controllers: [NotificationController],
    imports: [TypeOrmModule.forFeature([PostFeedAttachment]),ScheduleModule.forRoot()],
    providers: [bulkMailService,PostFeedAttachmentService],
})
export class cronJobModule { }
