import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { StatusEnum } from '../auth/status.enum';
import { StatusService } from './status.service';
import { UsersService } from '../users/users.service';
@Injectable()
export class StatusGuard implements CanActivate {
  constructor(
    private readonly statusService: StatusService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const status = await this.statusService.findByEnum(StatusEnum.Active);
    const userEntity = await this.userService.findOneEntity({
      where: { id: user.sub },
    });

    return status === userEntity.status;
  }
}
