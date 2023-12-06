import dto from '@shared/types/dto';
import { EMsgType } from '@shared/types/messages';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DTO_getUserById extends dto.id() {}
export class DTO_messageFormat {

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	chatId: number;

	@IsDefined()
	@IsEnum(EMsgType)
	type: EMsgType;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	content: string;
}