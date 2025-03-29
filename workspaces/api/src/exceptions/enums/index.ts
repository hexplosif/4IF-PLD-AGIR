import { AuthErrorCode } from "./authErrorCode.enum";
import { BaseErrorCode } from "./baseErrorCode.enum";
import { BookletErrorCode } from "./bookletErrorCode.enum";
import { QuizzErrorCode } from "./quizzErrorCode.enum";

export type ErrorCode = AuthErrorCode | BookletErrorCode | BaseErrorCode | QuizzErrorCode;
export { AuthErrorCode, BaseErrorCode, BookletErrorCode, QuizzErrorCode };

export const getTypeErrorCode = (errorCode: ErrorCode): string => {
	if (Object.values(AuthErrorCode).includes(errorCode as AuthErrorCode)) {
		return 'AuthErrorCode';
	}
	if (Object.values(BookletErrorCode).includes(errorCode as BookletErrorCode)) {
		return 'BookletErrorCode';
	}
	if (Object.values(QuizzErrorCode).includes(errorCode as QuizzErrorCode)) {
		return 'QuizzErrorCode';
	}
	return 'BaseErrorCode';
}

export const getNamespaceErrorCode = (errorCode: ErrorCode) => {
	if (Object.values(AuthErrorCode).includes(errorCode as AuthErrorCode)) {
		return 'AuthException';
	}
	if (Object.values(BookletErrorCode).includes(errorCode as BookletErrorCode)) {
		return 'BookletException';
	}
	if (Object.values(QuizzErrorCode).includes(errorCode as QuizzErrorCode)) {
		return 'QuizzException';
	}
	return 'BaseException';
}