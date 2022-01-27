import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { CheckVerificationTokenDto } from './dto/check-verification-token.dto';
import { SendVerificationTokenDto } from './dto/send-verification-token.dto';
import { Verify } from './verify.model';

@Injectable()
export class VerifyService {
    constructor(@InjectTwilio() private readonly client: TwilioClient) { }

    async sendPhoneVerificationToken(request: SendVerificationTokenDto) : Promise<Verify> {
        try {
            const res =  await this.client.verify.services(process.env.VERIFICATION_SID)
             .verifications
                .create({ to: request.phone_number, channel: 'sms' });
            const v = new Verify();
            v.id = res.sid;
            v.phone_number = res.to;
            v.status = res.status;
            v.expired_in = res.sendCodeAttempts[0]['time'];
            return v;
        } catch (error) {
            throw new HttpException('Send Verification failure!',HttpStatus.BAD_REQUEST);
        }
    }

    async checkPhoneVerificationToken(request: CheckVerificationTokenDto) : Promise<Verify> {
        try {
            const res =  await this.client.verify.services(process.env.VERIFICATION_SID)
             .verificationChecks
                .create({ to: request.phone_number, code: request.verify_code });
            const v = new Verify();
            v.id = res.sid;
            v.phone_number = res.to;
            v.status = res.status;
            v.expired_in = null;
            return v;
        } catch (error) {
            throw new HttpException('Check Verification failure!',HttpStatus.BAD_REQUEST);
        }
    }

}
