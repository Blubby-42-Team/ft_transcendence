import { Injectable, Logger } from '@nestjs/common';
import { Settings } from './settings.class';
import { PostgresSettingsService } from 'src/service/postgres/settings/settings.service';
import { ETheme } from '@shared/types/settings';
import { PostgresUserService } from 'src/service/postgres/user/user.service';

@Injectable()
export class ModelSettingsService {
	constructor (
		private readonly postgresSettingsService: PostgresSettingsService,
		private readonly postgresUserService: PostgresUserService,
	) {}
	
	private readonly logger = new Logger(ModelSettingsService.name);

	async getSettingsByUserId(userId: number): Promise<Settings> {
		await this.postgresUserService.getUserById(userId);
		return await this.postgresSettingsService.getSettingsByUserId(userId);
	}
	
	async updateSettingsByUserId(
			userId: number,
			theme: ETheme,
			sound: boolean,
		): Promise<string> {
		const settings = await this.postgresSettingsService.getSettingsByUserId(userId);
		return await this.postgresSettingsService.updateSettings(settings.id, theme, sound);
	}
}