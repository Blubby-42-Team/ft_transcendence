import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { DTO_getSettingsByUserId, DTO_updateSettings } from './settings.dto';
import { Roles } from 'src/auth/role.decorator';
import { UserRoleType } from 'src/auth/auth.class';
import { SettingsService } from './settings.service';
import { log } from 'console';

@Controller('settings')
export class SettingsController {

	constructor (
		private readonly settingsService: SettingsService,
	) {}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Get('/:id')
	async getSettingsByUserId(@Param() params: DTO_getSettingsByUserId) {
		log(`Get settings by user id ${params.id}`);
		return await this.settingsService.getSettingsByUserId(params.id);
	}

	@Roles([UserRoleType.User, UserRoleType.Admin, UserRoleType.Guest])
	@Patch('/:id')
	async updateSettingsByUserId(
		@Param() params: DTO_getSettingsByUserId,
		@Body() body: DTO_updateSettings,
	) {
		log(`Update settings by user id ${params.id}`);
		return await this.settingsService.updateSettingsByUserId(params.id, body.theme, body.sound);
	}
}
