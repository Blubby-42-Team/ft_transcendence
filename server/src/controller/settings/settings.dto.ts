import dto from '@shared/types/dto';
import { ETheme } from '@shared/types/settings';
import { IsBoolean, IsDefined, IsEnum, IsNotEmpty } from 'class-validator';

export class DTO_getSettingsByUserId extends dto.id() {}
export class DTO_updateSettings {

	@IsDefined()
	@IsNotEmpty()
	@IsBoolean()
	sound: boolean;

	@IsDefined()
	@IsEnum(ETheme)
	theme: ETheme;
}