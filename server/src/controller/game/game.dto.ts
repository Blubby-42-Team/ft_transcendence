import { IsDefined, IsNotEmpty, IsBoolean } from "class-validator";

export class GameWsDto {
	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	direction: boolean;

	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	press: boolean;
}