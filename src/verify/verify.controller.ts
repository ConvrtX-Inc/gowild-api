import { Body, Controller, Post } from '@nestjs/common';
import { CheckVerificationTokenDto } from './dto/check-verification-token.dto';
import { SendVerificationTokenDto } from './dto/send-verification-token.dto';
import { Verify } from './verify.model';
import { VerifyService } from './verify.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Verify')
@Controller({
  path: 'verify',
  version: '1',
})
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {
  }

  @Post('mobile/send')
  async sendPhoneVerificationToken(@Body() request: SendVerificationTokenDto): Promise<Verify> {
    return this.verifyService.sendPhoneVerificationToken(request);
  }

  @Post('mobile/check')
  async checkMobileVerificationToken(@Body() request: CheckVerificationTokenDto): Promise<Verify> {
    return this.verifyService.checkPhoneVerificationToken(request);
  }

}
