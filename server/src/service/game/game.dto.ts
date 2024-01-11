import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

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

export class DTO_CreateRoom {
	@IsNotEmpty()
	@IsDefined()
	@IsNumber()
	@IsPositive()
	userId: number;
	
	@IsNotEmpty()
	@IsDefined()
	@IsNumber()
	@IsPositive()
	max_round: number;

	@IsNotEmpty()
	@IsDefined()
	@IsNumber()
	@IsPositive()
	ball_size: number;

	@IsNotEmpty()
	@IsDefined()
	@IsNumber()
	@IsPositive()
	pad_size: number;
}