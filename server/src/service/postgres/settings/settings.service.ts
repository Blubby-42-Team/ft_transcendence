import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../../../model/settings/settings.class';
import { ETheme } from '@shared/types/settings';


@Injectable()
export class PostgresSettingsService {

	private readonly logger = new Logger(PostgresSettingsService.name);

	constructor (
		@InjectRepository(Settings) private readonly settingsRepository: Repository<Settings>,
	) {}
	
	/**
	 * Get settings by user id
	 * @param userId id of user
	 * @returns `Promise` settings
	 * @throws `NotFoundException` if settings of user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getSettingsByUserId(userId: number): Promise<Settings> {
		return this.settingsRepository.query(`
			SELECT s.*
			FROM public.user as u
			LEFT JOIN public.settings AS s
			ON u."settingsId" = s.id
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get settings by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get settings by user id ${userId}`);
		})
		.then((res): Settings => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get settings by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to get settings by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get settings by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get settings by user id ${userId}: too many results`);
			}
			return res[0];
		})

	}

	async updateSettings(
			settingsId: number,
			themeNew: ETheme,
			soundNew: boolean,
		) {
		return this.settingsRepository.update(settingsId, {
			theme: themeNew,
			sound: soundNew,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update settings ${settingsId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update settings ${settingsId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update settings ${settingsId}: ${res}`);
				throw new NotFoundException(`Failed to update settings ${settingsId}`);
			}
			return 'ok';
		})

	}
}

