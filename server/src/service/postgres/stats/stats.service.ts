import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '../../../model/stats/stats.class';
import { ModelStatsService } from 'src/model/stats/stats.service';


@Injectable()
export class PostgresStatsService {

	constructor (
		@InjectRepository(Stats) private readonly statsRepository: Repository<Stats>,
	) {}
	
	private readonly logger = new Logger(ModelStatsService.name);

	/**
	 * Get stats by user id
	 * @param userId id of user
	 * @returns `Promise` stats
	 * @throws `NotFoundException` if stats of user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getStatsByUserId(userId: number): Promise<Stats> {
		return this.statsRepository.query(`
			SELECT s.*
			FROM public.user as u
			LEFT JOIN public.stats AS s
			ON u."statsId" = s.id
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get stats by user id ${userId}`);
		})
		.then((res): Stats => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to get stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get stats by user id ${userId}: too many results`);
			}
			return res[0];
		})
	}
	
	async addPlayedMatch(userId: number) {
		const old = await this.getStatsByUserId(userId)
		return this.statsRepository.update(userId, {
			played_matchs: old.played_matchs + 1,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update played matchs of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update played matchs of ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update played matchs of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update played matchs of ${userId}:`);
			}
			return 'ok';
		})
	}

	async addClassicWon(userId: number) {
		const old = await this.getStatsByUserId(userId)
		return this.statsRepository.update(userId, {
			classic_match_won: old.classic_match_won + 1,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update won matchs of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update won matchs of ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update won matchs of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update won matchs of ${userId}:`);
			}
			return 'ok';
		})
	}

	async addClassicLose(userId: number) {
		const old = await this.getStatsByUserId(userId)
		return this.statsRepository.update(userId, {
			classic_match_lost: old.classic_match_lost + 1,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update lost matchs of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update lost matchs ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update lost matchs of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update lost matchs of ${userId}:`);
			}
			return 'ok';
		})
	}

	async addClassicPointWon(userId: number, score: number = 1) {
		const old = await this.getStatsByUserId(userId)
		return this.statsRepository.update(userId, {
			classic_match_points_won: old.classic_match_points_won + score,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update won points of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update won points ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update won points of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update won points of ${userId}:`);
			}
			return 'ok';
		})
	}

	async addClassicPointLost(userId: number, score: number = 1) {
		const old = await this.getStatsByUserId(userId)
		return this.statsRepository.update(userId, {
			classic_match_points_lost: old.classic_match_points_lost + score,
		})
		.catch((err) => {
			this.logger.debug(`Failed to update lost points of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update lost points ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update lost points of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update lost points of ${userId}:`);
			}
			return 'ok';
		})
	}

	async ModifyClassicMMR(userId: number, newMMR: number) {
		console.log(newMMR);
		return await this.statsRepository.update(userId, {
			classic_mmr: Math.floor(newMMR),
		})
		.catch((err) => {
			this.logger.debug(`Failed to update classic Matchmaking Ranking of ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update classic Matchmaking Ranking ${userId}`);
		})
		.then((res) => {
			if (res.affected === 0) {
				this.logger.debug(`Failed to update classic Matchmaking Ranking of ${userId}: ${res}`);
				throw new NotFoundException(`Failed to update classic Matchmaking Ranking of ${userId}:`);
			}
			return 'ok';
		})
	}

	async getClassicRankByUserId(
		userId: number,
	) {
		const res = await this.statsRepository.query(`
		SELECT
			ranking
		FROM
			(
				SELECT
					RANK() OVER (ORDER BY classic_mmr DESC) AS ranking,
					u.id AS user_id
				FROM
					"user" u
				JOIN
					stats s ON u."statsId" = s.id
			) AS user_ranking
		WHERE
			user_id = $1;
		`,
		[userId])
		return res[0].ranking
	}

	async getMMRByUserId(
		userId: number,
	) : Promise<number> {
		return await this.statsRepository.query(`
		SELECT s.classic_mmr
			FROM public.user as u
			LEFT JOIN public.stats AS s
			ON u."statsId" = s.id
			WHERE u.id = $1`,
			[userId]
		)
		.catch((err) => {
			this.logger.debug(`Failed to get mmr by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get mmr by user id ${userId}`);
		})
		.then((res): number => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get mmr by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to get mmr by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get mmr by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get mmr by user id ${userId}: too many results`);
			}
			return res[0].classic_mmr;
		})
	}
}

