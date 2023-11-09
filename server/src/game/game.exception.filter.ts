import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { log } from 'console';

import { Socket } from 'socket.io';


/**
 * Catch all BadRequestException and send it to the client by emitting an error `event`
 */
@Catch(BadRequestException)
export class WsBadRequestExceptionFilter extends BaseWsExceptionFilter {
	catch(exception: BadRequestException, host: ArgumentsHost) {
		//TODO LOG

		// Store the response from the exception
		const err = exception.getResponse();

		let errParse = null;
		try {
			// Try to parse the response
			const errStringify = JSON.stringify(err);
			errParse = JSON.parse(errStringify);
		} catch (e) {
			// If it fails, just log the response
			// TODO LOG
			return;
		}
		
		// log(errParse)

		const errType = errParse?.error ?? "Bad Request";
		const errMessage = errParse.message ?? "Undefined error";

		// Switch to WS context and get the client
		const client : Socket = host.switchToWs().getClient();
		// Emit the error to the client
		client.emit('error', { status: 'error', error: errType , message: errMessage});
	}
}