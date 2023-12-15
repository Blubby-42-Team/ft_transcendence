import { Injectable } from '@nestjs/common';
import { ModelSettingsService } from 'src/model/settings/settings.service';
import { ETheme } from '@shared/types/settings'

@Injectable()
export class SettingsService {

	constructor(
		private readonly modelSettingsService: ModelSettingsService,
	) {}

	async getSettingsByUserId(id: number) {
		return await this.modelSettingsService.getSettingsByUserId(id);
	}

	async updateSettingsByUserId(
		id: number,
		theme: ETheme,
		sound: boolean,
		) {
		return await this.modelSettingsService.updateSettingsByUserId(id, theme, sound);
	}
}
