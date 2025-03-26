import { AuthErrorCode } from "./authErrorCode.enum";
import { BaseErrorCode } from "./baseErrorCode.enum";

export type ErrorCode = AuthErrorCode | BaseErrorCode;
export { AuthErrorCode, BaseErrorCode };

export const getTypeErrorCode = (errorCode: ErrorCode): string => {
  if (Object.values(AuthErrorCode).includes(errorCode as AuthErrorCode)) {
    return 'AuthErrorCode';
  }
  return 'BaseErrorCode';
}

export const getNamespaceErrorCode = (errorCode: ErrorCode) => {
    if (Object.values(AuthErrorCode).includes(errorCode as AuthErrorCode)) {
        return 'AuthException';
      }
    return 'BaseException';
}