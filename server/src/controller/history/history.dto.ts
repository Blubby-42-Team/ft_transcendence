import dto from '@shared/types/dto';
import { EGameType } from '@shared/types/history';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class DTO_getHistoryByUserId extends dto.id() {}
export class DTO_addHistory {

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	opp_id: number;

	@IsDefined()
	@IsEnum(EGameType)
	game_type: EGameType;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	player_score: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	opp_score: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	duration: number;
}