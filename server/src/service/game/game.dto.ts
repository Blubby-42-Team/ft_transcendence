import { IsDefined, IsNotEmpty, IsString } from "class-validator/types/decorator/decorators";

export class JoinPartyDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	roomId: string;
}