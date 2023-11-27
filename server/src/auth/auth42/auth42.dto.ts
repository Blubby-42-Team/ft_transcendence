import { IsNotEmpty, IsNumber } from "class-validator";
import { Exclude } from "class-transformer";

export class User42Dto {
	@IsNotEmpty()
	@IsNumber()
	id42: number;

	@IsNotEmpty()
	login: string;

	displayName: string;

	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	accessToken: string;

	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	refreshToken: string;
}