import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err, user, info, context, status) {
        // const request = context.switchToHttp().getRequest();
        // const { mobile, password } = request.body;
        // if (err || !user) {
        //     if (!mobile) {
        //         throw new HttpException({ message: '手机号不能为空' }, HttpStatus.OK);
        //     } else if (!password) {
        //         throw new HttpException({ message: '密码不能为空' }, HttpStatus.OK);
        //     } else {
        //         throw err || new UnauthorizedException();
        //     }
        // }
        return user;
    }
}
