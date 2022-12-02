import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    // handleRequest(err, user, info, context, status) {
    //     const request = context.switchToHttp().getRequest();
    //     const response = context.switchToHttp().getResponse();
    //     const { mobile, password } = request.body;
    //     console.log(newUser);
    //     return user;
    // }
}
