import dto from '@shared/types/dto';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DTO_getUserById extends dto.id() {}
export class DTO_getBlacklistedUserById extends dto.id() {
	@IsDefined()
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	blacklistId: number
}
export class DTO_addFriendById {
	@IsNumber()
	@IsNotEmpty()
	@IsDefined()
	id: number
}

export class DTO_searchUserByLogin {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	login: string;
}
