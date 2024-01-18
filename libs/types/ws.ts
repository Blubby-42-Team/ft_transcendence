export interface WS<T> {
	status: 'ok' | 'error' | 'debug',
	message: T | WSError,
};

export type WSError = string | unknown;