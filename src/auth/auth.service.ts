import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { RoleEnum } from 'src/roles/roles.enum';
import * as crypto from 'crypto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/statuses/status.entity';
import { Role } from 'src/roles/role.entity';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
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

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.saveEntity({
      ...dto,
      email: dto.email,
      hash,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneEntity({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotService.saveEntity({
        hash,
        user,
      });

      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash,
        },
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
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

    const user = forgot.user;
    user.password = password;
    await user.save();
    await this.forgotService.softDelete(forgot.id);
  }

}
