import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { gameSettingsType } from '@shared/types/game/game';
import { GameEngine } from '@shared/game/game';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';
import { BotDifficulty } from '@shared/types/game/game';
import { InGameGateway } from './socket/in.gateway';
import { OutGameGateway } from './socket/out.gateway';

const defaultSettings: gameSettingsType = {
	maxPoint:			5,
	numPlayer:			2,
	ballSize:			1,
	padSize:			5,
	mode:				BotDifficulty.NORMAL,
	randomizer:			false,
	initialBallSpeed:	0.5,
	speedAcceleration:	0.1,
};
	

@Injectable()
export class GameService implements OnModuleInit {
	constructor(
		private readonly io: OutGameGateway,
	) { }

	private matchmakingList: Array<number> = [];
	private party: Map<
		// RoomId
		string,

		// Players id
		{
			players: Array<number>
			instance: GameEngine
		}
	> = new Map();

	onModuleInit(){
		this.matchPlayers();
	}

	getNewRoomId(): UUID{
		return uuidv4();
	}

	joinMatchmaking(userId: number){
		if (this.matchmakingList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is already in matchmaking`);
		}
		this.matchmakingList.push(userId);
	}

	leaveMatchmaking(userId: number){
		if (!this.matchmakingList.includes(userId)){
			throw new UnauthorizedException(`User ${userId} is not in matchmaking`);
		}
		this.matchmakingList = this.matchmakingList.filter(id => id !== userId);
	}

	matchPlayers(){
		if ((this.matchmakingList?.length ?? 0) >= 2){
			const player1 = this.matchmakingList.shift();
			const player2 = this.matchmakingList.shift();

			const roomId = this.getNewRoomId();

			this.party.set(roomId, {
				players: [player1, player2],
				instance: new GameEngine(defaultSettings, (state) => {
					this.io.emitGameState(roomId, state);
				})
			});
		}

		setTimeout(() => this.matchPlayers(), 1000);
	}

	isReady(userId: number){
		// Check if user is in matchmaking
		// If yes set him ready
	}

	createPrivateParty(userId: number, settings: gameSettingsType){

	}

	joinPrivateParty(partyId: string, userId: number){
		// Check if party is full
		// If not add him
	}

	inviteToPrivateParty(partyId: string, userId: number){

	}

	toJSON(){
		return {
			rooms: [...this.party.entries()].map(([roomId, { players }]) => ({ roomId, players }))
		}
	}
}