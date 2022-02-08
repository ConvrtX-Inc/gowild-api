import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import {AuthEmailLoginDto} from './dtos/auth-email-login.dto';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import {SocialInterface} from 'src/social/interfaces/social.interface';
import {AuthRegisterLoginDto} from './dtos/auth-register-login.dto';
import {UsersService} from 'src/users/users.service';
import {ForgotService} from 'src/forgot/forgot.service';
import {MailService} from 'src/mail/mail.service';
import {SmsService} from "src/sms/sms.service";
import {SocialAccountService} from "src/social-account/social-account.service";
import {plainToClass} from "class-transformer";
import {getConnection} from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private smsService: SmsService,
    private mailService: MailService,
    private socialAccountService: SocialAccountService,
  ) {
  }

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

      return {token, user: user};
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
  ) {
    let user: User;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneEntity({
      where: {
        email: socialEmail,
      },
    });

    const socialAccount = await this.socialAccountService.findOne({
      where: {
        social_id: socialData.id,
        provider: authProvider,
        account_email: socialEmail,
      },
    });

    if (socialAccount) {
      user = await this.usersService.findOneEntity({
        where: {
          id: socialAccount.user_id,
        },
      });
    }
    if (user) {
      if (!userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.saveEntity(user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      const full_name = socialData.firstName?.trim() + ' ' + socialData.lastName?.trim();
      user = await this.usersService.saveEntity({
        email: socialEmail,
        full_name: full_name,
        username: socialEmail,
      });
      await this.socialAccountService.saveEntity({
        user_id: user.id,
        social_id: socialData.id,
        provider: authProvider,
        account_email: socialEmail,
      });
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

  async resetAdminPassword(dto) {
    const user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });
    if (!user) {
      const user = await this.usersService.saveEntity({
        full_name: 'Admin',
        username: 'admin',
        email: 'admin@convrtx.com',
        password: dto.password ?? 'qwerty123',
      })
    } else {
      user.password = dto.password ?? 'qwerty123';
      await user.save();
    }
    return user;
  }

  async forgotPassword(dto): Promise<void> {
    let user = null;
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

  async me(user: User) {
    const data = await this.usersService.findOneEntity({
      where: {
        id: user.id,
      },
    });
    return {
      status: HttpStatus.OK,
      success: true,
      user: data
    }
  }

  async generateAdmin() {
    const user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });
    if (!user) {
      const user = await this.usersService.saveEntity({
        full_name: 'Admin',
        username: 'admin',
        email: 'admin@convrtx.com',
        password: 'qwerty123',
      })
    }
    return user;
  }
}
