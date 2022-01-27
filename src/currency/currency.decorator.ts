import { SetMetadata } from '@nestjs/common';

export const Currency = (...currency: number[]) =>
  SetMetadata('currency', currency);
