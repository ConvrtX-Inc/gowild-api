import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import fileConfig from './config/file.config';
import facebookConfig from './config/facebook.config';
import googleConfig from './config/google.config';
import firebaseConfig from './config/firebase.config';
import twitterConfig from './config/twitter.config';
import appleConfig from './config/apple.config';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { I18nJsonParser } from 'nestjs-i18n/dist/parsers/i18n.json.parser';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailConfigService } from './mail/mail-config.service';
import { ForgotModule } from './forgot/forgot.module';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { NotificationModule } from './notification/notification.module';
import { StatusModule } from './statuses/status.module';
import { CurrencyModule } from './currency/currency.module';
import { TwilioModule } from 'nestjs-twilio';
import { VerifyModule } from './verify/verify.module';
import { SmsModule } from './sms/sms.module';
import { SocialAccountModule } from './social-account/social-account.module';
import { ParticipantModule } from './messenger/participant/participant.module';
import { MessageModule } from './messenger/message/message.module';
import { ChatModule } from './messenger/chat/chat.module';
import { RoomModule } from './messenger/room/room.module';
import { FriendsModule } from './friends/friends.module';
import { RouteModule } from './route/route.module';
import { RouteCluesModule } from './route-clues/route-clues.module';
import { PostFeedModule } from './post-feed/post-feed.module';
import { LikeModule } from './like/like.module';
import { ShareModule } from './share/share.module';
import { CommentModule } from './comment/comment.module';
import { TreasureChestModule } from './treasure-chest/treasure-chest.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { GuidelinesModule } from './guideline/guideline.module';
import { RouteHistoricalEventsModule } from './route-historical-events/route-historical-events.module';
import { TicketModule } from './ticket/ticket.module';
import { TicketMessagesModule } from './ticket-messages/ticket-messages.module';
import { GuidelineLogsModule } from './guideline-logs/guideline-logs.module';
import { HealthModule } from './health/health.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  CookieSessionModule,
  NestCookieSessionOptions,
} from 'nestjs-cookie-session';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { SubAdminModule } from './sub-admin/sub-admin.module';
import { UserTreasureHuntModule } from './user-treasure-hunt/user-treasure-hunt.module';
import { CardsModule } from './cards/cards.module';
import { PostFeedAttachmentModule } from './post-feed-attchment/post-feed-attachment.module';
import { SystemSupportModule } from './system-support/system-support.module';
import { cronJobModule } from './jobs/cronjob.module';
import { LeaderBoardModule } from './leader-board/leader-board.module';
import awsConfig from './config/aws.config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
        firebaseConfig,
        awsConfig
      ],
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    CookieSessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): Promise<NestCookieSessionOptions> =>
        Promise.resolve({
          session: {
            secret: config.get('COOKIE_SECRET'),
            name: config.get('COOKIE_NAME'),
          },
        }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('app.fallbackLanguage'),
        parserOptions: {
          path: path.join(
            configService.get('app.workingDirectory'),
            'src',
            'i18n',
            'translations',
          ),
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    SmsModule,
    UsersModule,
    SocialAccountModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    ForgotModule,
    MailModule,
    HomeModule,
    NotificationModule,
    StatusModule,
    CurrencyModule,
    VerifyModule,
    ChatModule,
    RoomModule,
    ParticipantModule,
    MessageModule,
    FriendsModule,
    RouteModule,
    RouteCluesModule,
    PostFeedModule,
    LikeModule,
    ShareModule,
    CommentModule,
    TreasureChestModule,
    SponsorModule,
    GuidelinesModule,
    RouteHistoricalEventsModule,
    TicketModule,
    TicketMessagesModule,
    GuidelineLogsModule,
    HealthModule,
    DashboardModule,
    SubAdminModule,
    UserTreasureHuntModule,
    CardsModule,
    SystemSupportModule,
    CardsModule,
    PostFeedAttachmentModule,
    cronJobModule,
    LeaderBoardModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [DashboardController],
})
export class AppModule { }
