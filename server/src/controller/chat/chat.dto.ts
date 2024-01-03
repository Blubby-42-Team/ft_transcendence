import dto from '@shared/types/dto';
import { EChatType } from '@shared/types/chat';
import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
export class DTO_protectedChatFormat {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	password: string;
}
export class DTO_chatRequest  extends dto.id() {
	@IsDefined()
	@IsEnum(EChatType)
	type: EChatType;
}

export class DTO_getChatById extends dto.id() {
	@IsDefined()
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	chatId: number;
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
export class DTO_chatRemoveUser {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	toRemoveId: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}
export class DTO_chatAddAdmin {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	toAdd: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}
export class DTO_banUser {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	toBan: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}
export class DTO_unbanUser {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	toUnban: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}
export class DTO_chatPassword {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	password: string;
}

export class DTO_muteLength {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	toMute: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	length: number;
}

export class WSDTO_subcribeToChatUpdates {
	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	chatId: number;
}