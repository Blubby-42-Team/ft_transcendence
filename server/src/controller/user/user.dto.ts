import dto from '@shared/types/dto';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class DTO_getUserById extends dto.id() {}
export class DTO_addFriendById {
	@IsNumber()
	@IsNotEmpty()
	@IsDefined()
	id: number
}
