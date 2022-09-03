import { User } from '../../users/user.entity';
import { TokenResponse } from './token';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse<T> {
  @ApiProperty()
  token: TokenResponse;

  @Exclude()
  data: T;
}

export class UserAuthResponse extends AuthResponse<User> {
  @Expose()
  @ApiProperty()
  get user(): User {
    return this.data;
  }

  set user(u: User) {
    this.data = u;
  }
}
