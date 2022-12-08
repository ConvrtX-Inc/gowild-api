import {Controller, Get} from '@nestjs/common';

import {DashboardService} from "./dashboard.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Dashboard')
@Controller({
    path: 'dashboard',
    version: '1',
})
export class DashboardController {
    constructor(public service: DashboardService) {}


    @ApiOperation({ summary: 'Retrieve Total users, active users, Inactive Users' })
    @Get('users-info')
    getUserCount(){
        return this.service.getUserCount();
}
}
