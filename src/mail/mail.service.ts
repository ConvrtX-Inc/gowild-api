import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { StatusEnum } from 'src/auth/status.enum';
import { MailData } from './interfaces/mail-data.interface';
import { Status } from '../statuses/status.entity';

@Injectable()
export class MailService {
  constructor(
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
  }

  async userUpdateStatus(mailData: MailData<{}>, status?: Status) {
    let textMessage: string;
    switch (status.statusName) {
      case StatusEnum.Approved: {
        textMessage = await this.i18n.t('common.approved');
        break;
      }
      case StatusEnum.Rejected: {
        textMessage = await this.i18n.t('common.rejected');
        break;
      }
    }
    await this.mailerService.sendMail({
      to: mailData.to,
      subject:
        this.configService.get('app.name') +
        ' ' +
        (await this.i18n.t('common.emailSubject')),
      text: '',
      template: './user-update-status',
      context: {
        app_name: this.configService.get('app.name'),
        header: (await this.i18n.t('common.hello')) + ' ' + mailData.name,
        bodyMessage: textMessage,
        footer1: await this.i18n.t('common.sincerely'),
        footer2: await this.i18n.t('common.team'),
      },
    });
  }

  async userSignUp(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.confirmEmail'),
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.hash
      } ${await this.i18n.t('common.confirmEmail')}`,
      template: './activation',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.resetPassword'),
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.hash
      } ${await this.i18n.t('common.resetPassword')}`,
      template: './reset-password',
      context: {
        title: await this.i18n.t('common.resetPassword'),
        url: `${this.configService.get('app.frontendDomain')}/password-change/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.resetPassword'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('reset-password.text1'),
        text2: await this.i18n.t('reset-password.text2'),
        text3: await this.i18n.t('reset-password.text3'),
        text4: await this.i18n.t('reset-password.text4'),
      },
    });
  }
}
