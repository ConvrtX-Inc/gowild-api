import { Injectable, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';
import { SocialAccountService } from 'src/social-account/social-account.service';
import { PasswordService } from '../users/password.service';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthResetPasswordAdminDto } from './dtos/auth-reset-password.dto';
import { UserAuthResponse, SuccessResponse } from './dtos/auth-response';
import { TokenService } from './token.service';
import { TokenResponse } from './dtos/token';
import { SmsService } from '../sms/sms.service';
import { StatusEnum } from './status.enum';
import { StatusService } from '../statuses/status.service';
import { randomInt } from "crypto";
import { RoleService } from "../roles/role.service";
import { RoleEnum } from "../roles/roles.enum";
import { AuthVerifyUserDto } from "./dtos/auth-verify-user.dto";
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly forgotService: ForgotService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly socialAccountService: SocialAccountService,
    private readonly passwordService: PasswordService,
    private readonly statusService: StatusService,
    private readonly roleService: RoleService,
  ) { }

  public async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<TokenResponse> {
    const status = await this.statusService.findByEnum(StatusEnum.Active);
    const user = await this.usersService.findOneEntity({
      where: {
        email: loginDto.email,
        status: status.id

      },
    });

    const isValidPassword = await this.passwordService.verifyPassword(
      user,
      loginDto.password,
    );

    if (isValidPassword) {
      return await this.tokenService.generateToken(user);
    } else {
      throw new UnprocessableEntityException({
        errors: [
          {
            password: 'incorrectCredentials',
          },
        ],
      });
    }
  }

  public async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<UserAuthResponse> {
    let user: UserEntity;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneEntity({
      where: {
        email: socialEmail,
      },
    });

    const socialAccount = await this.socialAccountService.findOne({
      where: {
        socialId: socialData.id,
        provider: authProvider,
        accountEmail: socialEmail,
      },
    });

    if (socialAccount) {
      user = await this.usersService.findOneEntity({
        where: {
          id: socialAccount.userId,
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
      let entity = new UserEntity();
      entity.firstName = socialData.firstName;
      entity.lastName = socialData.lastName;
      entity.email = socialEmail;
      entity.username = socialEmail;
      entity.status = await this.statusService.findByEnum(StatusEnum.Active);
      entity.role = await this.roleService.findByEnum(RoleEnum.USER);

      entity = await this.usersService.saveEntity(entity);
      await this.socialAccountService.saveEntity({
        userId: entity.id,
        socialId: socialData.id,
        provider: authProvider,
        accountEmail: socialEmail,
      });
      user = await this.usersService.findOneEntity({
        where: {
          id: entity.id,
        },
      });
    }
    const token = await this.tokenService.generateToken(user);
    const response = new UserAuthResponse();
    //response.user = user;
    response.token = token;
    return response;
  }

  public async register(dto: AuthRegisterLoginDto): Promise<UserEntity> {
    const hash = this.genHash();

    let entity = new UserEntity();
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.gender = dto.gender;
    entity.email = dto.email;
    entity.username = null;
    entity.phoneNo = dto.phoneNo;
    entity.addressOne = dto.addressOne;
    entity.addressTwo = dto.addressTwo;
    entity.otp = '0000';
    entity.phoneVerified = false;
    entity.hash = hash;


    entity.status = await this.statusService.findByEnum(StatusEnum.Active);
    entity.role = await this.roleService.findByEnum(RoleEnum.USER);
    entity = await this.usersService.saveEntity(entity);
    await this.passwordService.createPassword(entity, dto.password);
    return entity;
  }

  public async resetAdminPassword(
    dto: AuthResetPasswordAdminDto,
  ): Promise<UserEntity> {
    let user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });

    const password = dto.password ?? 'qwerty123';
    if (!user) {
      user = new UserEntity();
      user.firstName = 'Admin';
      user.lastName = 'Family';
      user.username = 'admin';
      user.email = 'admin@convrtx.com';
      user.status = await this.statusService.findByEnum(StatusEnum.Active);
      user.role = await this.roleService.findByEnum(RoleEnum.SUPER_ADMIN);
      user = await this.usersService.saveEntity(user);
    }

    await this.passwordService.createPassword(user, password);
    return user;
  }

  async forgotPassword(dto: AuthForgotPasswordDto) {
    let user = null;
    let emailPhone = null;
    if (dto.phone) {
      emailPhone = dto.phone;
      user = await this.usersService.findOneEntity({
        where: {
          phoneNo: dto.phone,
        },
      });
    } else {
      emailPhone = dto.email;
      user = await this.usersService.findOneEntity({
        where: {
          email: dto.email,
        },
      });
    }

    if (!user) {
      throw new NotFoundException({
        user: 'user do not exist',
      });
    }

    //const hash = randomInt(9999).toString();
    const hash = '0000';
    await this.forgotService.saveEntity({
      hash,
      emailPhone,
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
      // await this.smsService.send({
      //   phone_number: user.phone_no.toString(),
      //   message:
      //     'You have requested reset password on Go Wild App. Please use this code to reset password:' +
      //     hash,
      // });
      // Will uncomment when twilio account provided
    }
    return {
      status: HttpStatus.OK,
      message: "Success"
    }
  }

  public async verifyMobile(emailPhone: string, hash: string): Promise<SuccessResponse> {
    let user = null;
    const forgot = await this.forgotService.findOneEntity({
      where: {
        emailPhone,
        hash
      },
    });
    if (!forgot) {
      throw new NotFoundException({
        hash: `notFound`,
      });
    }
    return {
      message: "OTP Varified Successfully"
    }
  }

  public async resetPassword(hash: string, emailPhone: string, password: string): Promise<SuccessResponse> {
    let user = null;
    const forgot = await this.forgotService.findOneEntity({
      where: {
        hash,
        emailPhone
      },
    });
    if (!forgot) {
      throw new NotFoundException({
        hash: `notFound`,
      });
    }
    user = forgot.user;
    await this.forgotService.softDelete(forgot.id);
    await this.passwordService.createPassword(user, password);
    await user.save();
    return {
      message: "Password Reset Successfull"
    }
  }

  public async verifyOTP(dto: AuthVerifyUserDto): Promise<TokenResponse> {
    const email = dto.email;
    const phoneNo = dto.phoneNo;
    const otp = dto.otp;
    const user = await this.usersService.findOneEntity({
      where: {
        email,
        phoneNo,
        otp
      },
    });
    if (!user) {
      throw new NotFoundException({
        otp: `notFound`,
      });
    }
    user.otp = null;
    user.phoneVerified = true;
    await user.save();
    return await this.tokenService.generateToken(user);
  }
  public async me(userId: string): Promise<UserEntity> {
    return await this.usersService.findOneEntity({
      where: {
        id: userId,
      },
    });
  }

  public async generateAdmin() {
    let user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });

    if (!user) {
      user = new UserEntity();
      user.firstName = 'Admin';
      user.lastName = 'User';
      user.username = 'admin';
      user.email = 'admin@convrtx.com';
      user = await this.usersService.saveEntity(user);
    }

    await this.passwordService.createPassword(user, 'qwerty123');
    return user;
  }

  public async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const entity = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.tokenService.invalidateRefreshToken(entity);
    const userId = this.tokenService.userIdByRefreshToken(refreshToken);
    const user = await this.usersService.findOne(userId);
    return this.tokenService.generateToken(user);
  }

  private genHash(): string {
    return crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
  }
}
