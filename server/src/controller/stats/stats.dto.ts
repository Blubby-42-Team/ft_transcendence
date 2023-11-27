import dto from '@shared/types/dto';
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class DTO_getStatsByUserId extends dto.id() {}
export class DTO_matchEnd {

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	points_won: number;

	@IsDefined()
	@IsNotEmpty()
	@IsNumber()
	points_lost: number;

	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	game_won: boolean;
}