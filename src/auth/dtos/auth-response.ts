import { UserEntity } from '../../users/user.entity';
import { TokenResponse } from './token';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse<T> {
  @ApiProperty()
  token: TokenResponse;

  @Exclude()
  data: T;
}

export class UserAuthResponse extends AuthResponse<UserEntity> {
  @Expose()
  @ApiProperty()
  get user(): UserEntity {
    return this.data;
  }

  set user(u: UserEntity) {
    this.data = u;
  }
}

export class SuccessResponse {
  message?: string;
  data?: { [key: string]: unknown }[];
}
