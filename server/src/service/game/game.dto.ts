import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator";

export class JoinPartyDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	roomId: string;
}

export class DTO_PlayerMove {
	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	direction: boolean;

	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	press: boolean;
}


export class DTO_StartRound {
	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	press: boolean;
}