import { IsNotEmpty, IsJWT, isNotEmpty, IsString } from 'class-validator'

export class JoinRoomRequest {
	@IsNotEmpty()
	@IsJWT()
	token: string;

}

export class AcknowledgmentWsDto {

	constructor(status: 'ok' | 'error' | 'debug', message: string) {
		this.status = status;
		this.message = message;
	}

	@IsNotEmpty()
	@IsString()
	status: 'ok' | 'error' | 'debug';

	@IsString()
	message: string;
}
