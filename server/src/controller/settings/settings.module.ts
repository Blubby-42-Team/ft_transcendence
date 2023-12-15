import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

import { Module } from '@nestjs/common';
import { ModelSettingsModule } from 'src/model/settings/settings.module';

@Module({
	imports: [
		ModelSettingsModule
	],
	controllers: [
		SettingsController,
	],
	providers: [
		SettingsService,
	],
})
export class ControllerSettingsModule { }
