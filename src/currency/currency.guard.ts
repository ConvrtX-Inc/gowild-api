import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CurrencyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const currency = this.reflector.getAllAndOverride<number[]>('currency', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!currency.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return currency.includes(request.activity?.id);
  }
}
