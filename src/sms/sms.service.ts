import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { SmsDto } from './dto/sms.dto';

@Injectable()
export class SmsService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async send(request: SmsDto) {
    try {
      return await this.client.messages
        .create({
          to: request.phone_number,
          body: request.message,
          from: process.env.TWILIO_PHONE_NUMBER,
        })
        .then((message) => message);
    } catch (error) {
      throw new BadRequestException({
        errors: [
          {
            details: 'Something went wrong: ' + error.message,
          },
        ],
      });
    }
  }
}
