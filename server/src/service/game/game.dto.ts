import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class JoinPartyDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	roomId: string;
}