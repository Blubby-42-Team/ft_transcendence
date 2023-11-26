import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export enum UserRoleType {
	Admin		= 'ADMIN',
	User		= 'USER',
	System		= 'SYSTEM',
	Guest		= 'GUEST',
}

export class UserAuthTokenDto {
	@IsNumber()
	@IsNotEmpty()
	userId: number;

	@IsString()
	@IsNotEmpty()
	@IsEnum(UserRoleType)
	role: UserRoleType;

	@IsString()
	@IsNotEmpty()
	displayName: string;

	@IsString()
	@IsNotEmpty()
	login42: string;

	@IsNumber()
	@IsNotEmpty()
	id42: number;
}