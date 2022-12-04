import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {RoleEnum} from "./roles.enum";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<RoleEnum[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireRoles) {
            return true;
        }
        const {user}=context.switchToHttp().getRequest();
        return requireRoles.some((role) => user.user.role.includes(role));
    }
}