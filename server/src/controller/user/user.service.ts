import { Injectable } from '@nestjs/common';
import { UserTelemetryStatus } from '@shared/types/user/user';
import { ModelUserService } from 'src/model/user/user.service';

@Injectable()
export class UserService {

	constructor(
		private readonly modelUserService: ModelUserService,
	) {}

	async getUserById(id: number) {
		return await this.modelUserService.getUserByIdForWilla(id);
	}

	async getUserByLogin(login: string) {
		return await this.modelUserService.getUserByLogin(login);
	}

	async getFriendsById(id: number) {
		return await this.modelUserService.getFriendsById(id);
	}

	async addFriendById(id: number, friendId: number) {
		return await this.modelUserService.addFriendById(id, friendId);
	}

	async deleteFriendById(id: number, friendId: number) {
		return await this.modelUserService.deleteFriendById(id, friendId);
	}

	async getWhitelistById(id: number) {
		return await this.modelUserService.getWhitelistById(id);
	}

	async addWhitelistById(id: number, whitelistId: number) {
		return await this.modelUserService.addWhitelistById(id, whitelistId);
	}

	async getBlacklistById(id: number) {
		return await this.modelUserService.getBlacklistById(id);
	}

	async isInBlacklistById(id: number, blacklistId: number) {
		return await this.modelUserService.isInBlacklistById(id, blacklistId);
	}

	async addBlacklistById(id: number, blacklistId: number) {
		return await this.modelUserService.addBlacklistById(id, blacklistId);
	}

	async deleteBlacklistById(id: number, blacklistId: number) {
		return await this.modelUserService.deleteBlacklistById(id, blacklistId);
	}

	async setStatusTelemitry(id: number, status: UserTelemetryStatus) {
		return await this.modelUserService.setUserStatus(id, status);
	}

	async getStatusTelemitry(id: number) {
		return await this.modelUserService.getUserStatus(id);
	}
}
