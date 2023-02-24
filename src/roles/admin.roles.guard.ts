import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN];
    const { user } = context.switchToHttp().getRequest();
    return requireRoles.some((role) => user.user.role.includes(role));
  }
}
