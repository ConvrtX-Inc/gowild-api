import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
  constructor(...errors: any[]) {
    super({ errors }, HttpStatus.NOT_FOUND);
  }
}
