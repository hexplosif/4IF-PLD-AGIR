import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseErrorCode, ErrorCode } from './enums';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    // Catch all error and convert them to HttpException

    catch(exception: any, host: ArgumentsHost) {
        // If it is HttpException, just throw it
        if (exception instanceof HttpException) {
            throw exception;
        }

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode : ErrorCode = BaseErrorCode.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof Error) {
            message = exception.message || 'Unexpected Error';
            if (exception.name === 'ForbiddenError') {
                status = HttpStatus.FORBIDDEN;
                errorCode = BaseErrorCode.FORBIDDEN;
            }
        }

        console.error('Unhandled Error:', exception);

        // Throw HttpException
        throw new HttpException(
            { 
                statusCode: status,
                errorCode,
                message,
                timestamp: new Date().toISOString()
            }, 
            status
        );
    }
}