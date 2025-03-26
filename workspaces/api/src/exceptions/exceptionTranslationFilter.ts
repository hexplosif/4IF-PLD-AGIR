import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BaseErrorCode, ErrorCode, getNamespaceErrorCode } from './enums';

@Catch(HttpException)
export class ExceptionTranslationFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const errorCode = exceptionResponse.errorCode as ErrorCode || BaseErrorCode.UNKNOWN_ERROR;

    // Translate the error message
    const typeErrorCode = getNamespaceErrorCode(errorCode);
    const message = this.i18n.t(`${typeErrorCode}.${errorCode}`, { lang: I18nContext.current().lang });

    response.status(status).json({
        statusCode: status,
        errorCode,
        message,
        timestamp: new Date().toISOString()
    });
  }
}
