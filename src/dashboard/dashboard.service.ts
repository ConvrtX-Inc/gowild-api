import { Injectable } from '@nestjs/common';

import {UsersService} from "../users/users.service";

@Injectable()
export class DashboardService {
    constructor(
        private readonly userService: UsersService
    ) { }

   async getUserCount(){
        return this.userService.getUserCount();
   }
}

