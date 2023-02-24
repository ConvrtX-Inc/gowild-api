import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { PostFeedAttachmentService } from 'src/post-feed-attchment/post-feed-attachment.service';

@Injectable()
export class bulkMailService {
  constructor(
    private readonly PostFeedAttachmentService: PostFeedAttachmentService,
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(bulkMailService.name);

  @Cron('5 * * * * *')
  async handleCron() {
    // this.logger.debug('Called when the current second is 45');
    // const sendEventMail = async () => {
    //   console.log("Cron JOB is running");
    //   await this.mailerService.sendMail({
    //     to: "71abdulhaseeb71@gmail.com",
    //     subject:
    //       this.configService.get('app.name') +
    //       ' ' +
    //       (await this.i18n.t('common.emailSubject')),
    //     text: '',
    //     template: process.cwd() + '/mail-templates/user-update-status',
    //     context: {
    //       app_name: this.configService.get('app.name'),
    //       header: (await this.i18n.t('common.hello')) + ' ' + "hekko",
    //       bodyMessage: "meesage",
    //       footer1: await this.i18n.t('common.sincerely'),
    //       footer2: await this.i18n.t('common.team'),
    //     },
    //   });
    // }
    // await sendEventMail();
  }
}
