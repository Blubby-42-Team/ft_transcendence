import { IsNotEmpty, IsJWT } from 'class-validator'

export class JoinRoomRequest {
	@IsNotEmpty()
	@IsJWT()
	token: string;

}