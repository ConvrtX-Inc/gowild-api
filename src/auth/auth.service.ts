import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from "src/sms/sms.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private smsService: SmsService,
    private mailService: MailService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findOneEntity({
      where: {
        email: loginDto.email,
      },
    });

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<{ token: string; user: User }> {
    let user: User;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneEntity({
      where: {
        email: socialEmail,
      },
    });

    // user = await this.usersService.findOneEntity({
    //   where: {
    //     social_id: socialData.id,
    //     provider: authProvider,
    //   },
    // });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.saveEntity(user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {

      // user = await this.usersService.saveEntity({
      //   email: socialEmail,
      //   provider: authProvider,
      // });

      user = await this.usersService.findOneEntity({
        where: {
          id: user.id,
        },
      });
    }

    const jwtToken = await this.jwtService.sign({
      id: user.id,
    });

    return {
      token: jwtToken,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<User> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.saveEntity({
      ...dto,
      email: dto.email,
      phone_no: dto.phone_no,
      hash,
    });
    return user;
  }

  async forgotPassword(dto): Promise<void> {
    let user = null;
    console.log(dto)
    if (dto.email) {
      user = await this.usersService.findOneEntity({
        where: {
          email: dto.email,
        },
      });
    } else {
      user = await this.usersService.findOneEntity({
        where: {
          phone_no: dto.phone,
        },
      });
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'user do not exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = Math.floor(1000 + Math.random() * 9000).toString();
      await this.forgotService.saveEntity({
        hash,
        user,
      });
      if (dto.email) {
        await this.mailService.forgotPassword({
          to: dto.email,
          data: {
            hash,
          },
        });
      } else {
        await this.smsService.send({
          phone_number: user.phone_no.toString(),
          message: 'You have requested reset password on Go Wild App. Please use this code to reset password:' + hash
        });
      }
    }
  }

  async resetPassword(
    hash: string,
    password: string,
  ): Promise<void> {
    let user = null;
    const forgot = await this.forgotService.findOneEntity({
      where: {
        hash,
      },
    });
    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    user = forgot.user;
    await this.forgotService.softDelete(forgot.id);
    user.password = password;
    await user.save();
  }

}
