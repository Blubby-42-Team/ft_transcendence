import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../../../model/history/history.class';
import { EGameType } from '@shared/types/history';
import { PostgresUserModule } from '../user/user.module';
import { User } from 'src/model/user/user.class';


@Injectable()
export class PostgresHistoryService {

	private readonly logger = new Logger(PostgresHistoryService.name);

	constructor (
		@InjectRepository(History) private readonly historyRepository: Repository<History>,
	) {}
	
	/**
	 * Get history by user id
	 * @param userId id of user
	 * @returns `Promise` history
	 * @throws `NotFoundException` if history of user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getHistoryByUserId(userId: number): Promise<History> {
		return this.historyRepository.query(`
			SELECT * FROM "history"
			WHERE "playerId" = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get stats by user id ${userId}`);
		})
	}

	async addHistory(
		userId: number,
		opp_id: number,
		game_type: EGameType,
		player_score: number,
		opp_score: number,
	) {
		const player = new User()
		player.id = userId

		const opponent = new User()
		opponent.id = opp_id

		const match = new History;
		match.date = new Date(Date.now());

		match.player = player
		match.game_type = game_type;
		match.opp = opponent;
		match.opp_score = opp_score;
		match.player_score = player_score;
		
		return this.historyRepository.save(match)
		.catch((err) => {
			this.logger.debug("Could not add match history");
			throw new InternalServerErrorException("Could not add match history");
		})
		.then((res) => {
			return res.id;
		})
	}
}

