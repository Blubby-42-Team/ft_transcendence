import dto from '@shared/types/dto';
import { EChatType } from '@shared/types/chat';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DTO_getUserById extends dto.id() {}
export class DTO_chatFormat {
	@IsDefined()
	@IsEnum(EChatType)
	type: EChatType;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	name: string;
}
export class DTO_chatRequest {
	@IsDefined()
	@IsEnum(EChatType)
	type: EChatType;
}
export class DTO_chatAddUser {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	friendId: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}