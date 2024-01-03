import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

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

export class User2FASessionTokenDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsUUID('4')
	uuid: UUID;
}