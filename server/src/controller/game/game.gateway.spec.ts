import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { GatewayGameService } from './gateway.game.service';
import { AuthService } from '../../auth/auth.service';

import * as jwt from 'jsonwebtoken';
import { GameService } from 'src/service/game/game.service';
import { ModelGameModule } from 'src/model/game/game.module';
import { ModelGameService } from 'src/model/game/game.service';
import { AcknowledgmentWsDto, CreateGameRoomRequestDto, createGameRoomResponse } from '@shared/dto/ws.dto';
import { PostgresModule } from 'src/service/postgres/postgres.module';
import { GameModule } from 'src/service/game/game.module';
import { ControllerGameModule } from './game.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import exp from 'constants';

describe('GameGateway', () => {
	let gameGateway: GameGateway;
	let gatewayGameService: GatewayGameService;

	const user1 = {
		"userId": 1,
		"role": "USER",
		"displayName": "Matthew Hadad",
		"id42": 97364,
		"login42": "mahadad",	
	};
	const user2 = {
		"userId": 2,
		"role": "USER",
		"displayName": "Matthew Hadad",
		"id42": 97364,
		"login42": "mahadad",
	}
	let jwt_user1: string;
	let jwt_user2: string;


	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GameGateway,
				GatewayGameService,
				ModelGameService,
			],
			imports: [
				PostgresModule,
				AuthModule,
				ModelGameModule,
				GameModule,
				ControllerGameModule,
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: '.env',
				}),
			]

		}).compile();

		gameGateway = module.get<GameGateway>(GameGateway);
		gatewayGameService = module.get<GatewayGameService>(GatewayGameService);

		/**
		 * JWTs for testing
		 * secret: 'secret'
		 */
		const secret = 'secret';
		
		jwt_user1 = jwt.sign(user1, secret)
		jwt_user2 = jwt.sign(user2, secret)
	});

	it('should be defined', () => {
		expect(gameGateway).toBeDefined();
	});

	describe('handleConnection', () => {
		it('should log a message when a client connects', () => {
		const client = { id: '1' } as any;
		const logSpy = jest.spyOn(gameGateway.logger, 'debug');
		gameGateway.handleConnection(client);
		expect(logSpy).toHaveBeenCalledWith('Client 1 connected');
		});
	});

	describe('handleDisconnect', () => {
		it('should log a message when a client disconnects', () => {
		const client = { id: '1' } as any;
		const logSpy = jest.spyOn(gameGateway.logger, 'debug');
		gameGateway.handleDisconnect(client);
		expect(logSpy).toHaveBeenCalledWith('Client 1 disconnected');
		});
	});

	let game_room_id;

	describe('createMyRoom', () => {
		it('should call the gatewayGameService to create a lobby', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const req = new CreateGameRoomRequestDto();
			req.auth_token = jwt_user1;

			const res = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(req);

			game_room_id = res?.message?.game_room_id;

			const expectedRes = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(res).toEqual(expectedRes);
		});

		it('should\\n create duplicate lobby', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const req = new CreateGameRoomRequestDto();
			req.auth_token = jwt_user1;

			const res1 = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res1)}`);

			game_room_id = res1?.message?.game_room_id;

			const expectedRes1 = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(res1).toEqual(expectedRes1);

			const res2 = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res2)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(2);
			expect(createLobbySpy).toHaveBeenCalledWith(req);

			const expectedRes2 = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is allready the lobby ${game_room_id}`);
			expect(res2).toEqual(expectedRes2);
		});

	});

});