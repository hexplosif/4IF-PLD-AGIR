import { HttpException, HttpStatus } from '@nestjs/common';
import { type ErrorCode } from './enums';

export class AppException extends HttpException {
  constructor(errorCode: ErrorCode, status: HttpStatus, message?: string) {
    super({ errorCode, message }, status);
  }
}
