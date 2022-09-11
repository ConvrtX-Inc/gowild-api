import { Module } from '@nestjs/common';
import { SocialAccountController } from './social-account.controller';
import { SocialAccountService } from './social-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccount } from './social-account.entity';

@Module({
  controllers: [SocialAccountController],
  providers: [SocialAccountService],
  exports: [SocialAccountService],
  imports: [TypeOrmModule.forFeature([SocialAccount])],
})
export class SocialAccountModule {}
