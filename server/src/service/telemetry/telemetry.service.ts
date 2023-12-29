/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UserTelemetryStatus } from '@shared/types/user/user';
import { TelemetryUserEmitGateway } from './telemetry.user.gateway';

type userTelemetry = {
	status: UserTelemetryStatus;
	lastUpdate: Date;
};

@Injectable()
export class TelemetryService implements OnModuleInit, OnModuleDestroy {

	private readonly logger = new Logger(TelemetryService.name);

	constructor(
		private readonly telemetryUserEmitGateway: TelemetryUserEmitGateway,
	) {}

	/**
	 * Map of user id and their status
	 */
	private readonly userStatus: Map<number, userTelemetry> = new Map();
	private readonly userStatusTTL: number = 1000 * 6

	private garbageCollectorTimeout: NodeJS.Timeout;
	private readonly garbageCollectorInterval: number = 1000 * 1



	async onModuleInit() {
		this.garbageCollectorTimeout = setInterval(() => {
			this.userStatus.forEach((_, key) => {

				if (_ === undefined) {
					this.userStatus.delete(key);
					return;
				}

				// If the user is offline, remove it from the cache
				if (_.status === UserTelemetryStatus.Offline) {
					this.userStatus.delete(key);
					return;
				}

				// If the user TTL is expired, remove it from the cache and will be considered as offline
				if (new Date().getTime() - _.lastUpdate.getTime() > this.userStatusTTL) {
					this.logger.debug(`User ${key} TTL expired, remove it from the cache!`);
					this.setUserStatus(key, UserTelemetryStatus.Offline);
					return;
				}
			})
		}, this.garbageCollectorInterval);
	}

	onModuleDestroy() {
		clearTimeout(this.garbageCollectorTimeout);
	}

	async setUserStatus(id: number, status: UserTelemetryStatus) {

		// If the user is offline, remove it from the cache
		if (status === UserTelemetryStatus.Offline) {
			this.userStatus.delete(id);
		}

		if (status !== UserTelemetryStatus.Offline) {
			this.userStatus.set(id, {
				status,
				lastUpdate: new Date(),
			});
		}

		this.telemetryUserEmitGateway.server.emit(`telemetry.status.${id}`, status ?? UserTelemetryStatus.Offline)
	}

	/**
	 * Get the status of a user
	 * @param id user id
	 * @returns UserTelemetryStatus of the user
	 * @returns undefined if the user is not in the memory cache
	 */
	async getUserStatus(id: number): Promise<UserTelemetryStatus> {
		const status = this.userStatus.get(id)?.status;
		
		if (status === undefined) {
			this.logger.debug(`User ${id} is undefined in the cache?! return offline`);
			return UserTelemetryStatus.Offline;
		}

		if (status === UserTelemetryStatus.Offline) {
			this.logger.warn(`User ${id} is offline but still in the cache, remove it from the cache!!`)
			this.userStatus.delete(id);
		}

		return status;
	}

}
