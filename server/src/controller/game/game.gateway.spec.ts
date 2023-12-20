import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { GatewayGameService } from './gateway.game.service';

import * as jwt from 'jsonwebtoken';
import { ModelGameModule } from 'src/model/game/game.module';
import { ModelGameService } from 'src/model/game/game.service';
import { AcknowledgmentWsDto, CreateGameRoomRequestDto, JoinGameRoomRequestDto, addOrRemovePlayerToWhiteListResponse, addPlayerToWhiteListRequestDto, createGameRoomResponse, joinGameResponse } from '@shared/dto/ws.dto';
import { PostgresModule } from 'src/service/postgres/postgres.module';
import { GameModule } from 'src/service/game/game.module';
import { ControllerGameModule } from './game.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

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
	const user3 = {
		"userId": 3,
		"role": "USER",
		"displayName": "Matthew Hadad",
		"id42": 97364,
		"login42": "mahadad",
	}
	const user4 = {
		"userId": 4,
		"role": "USER",
		"displayName": "Matthew Hadad",
		"id42": 97364,
		"login42": "mahadad",
	}
	const user5 = {
		"userId": 5,
		"role": "USER",
		"displayName": "Matthew Hadad",
		"id42": 97364,
		"login42": "mahadad",
	}

	let jwt_user1: string;
	let jwt_user2: string;
	let jwt_user3: string;
	let jwt_user4: string;
	let jwt_user5: string;


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
		jwt_user3 = jwt.sign(user3, secret)
		jwt_user4 = jwt.sign(user4, secret)
		jwt_user5 = jwt.sign(user5, secret)
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

	describe('createMyRoom', () => {
		it('should call the gatewayGameService to create a lobby', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const req = new CreateGameRoomRequestDto();
			req.auth_token = jwt_user1;

			const res = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(req);

			const game_room_id = res?.message?.game_room_id;

			const expectedRes = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(res).toEqual(expectedRes);
		});

		it('should\'n create duplicate lobby when allredy have one', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const req = new CreateGameRoomRequestDto();
			req.auth_token = jwt_user1;

			// 1st call 
			const res1 = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res1)}`);

			const game_room_id = res1?.message?.game_room_id;

			// 1st call should return ok
			const expectedRes1 = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(res1).toEqual(expectedRes1);

			// 2nd call
			const res2 = await gameGateway.createMyRoom(req);

			console.debug(`res: ${JSON.stringify(res2)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(2);
			expect(createLobbySpy).toHaveBeenCalledWith(req);

			// 2nd call should return an error
			const expectedRes2 = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is allready the lobby ${game_room_id}`);
			expect(res2).toEqual(expectedRes2);
		});

	});

	describe('joinRoom', () => {
		it('should call the gatewayGameService to join a lobby', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const reqCreate = new CreateGameRoomRequestDto();
			reqCreate.auth_token = jwt_user1;

			const resCreate = await gameGateway.createMyRoom(reqCreate);

			console.debug(`res: ${JSON.stringify(resCreate)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);

			/**
			 * Add user2 to the whitelist
			 */

			const addPlayerToWhiteListSpy = jest.spyOn(gameGateway, 'addPlayerToWhiteList');

			const reqAdd = new addPlayerToWhiteListRequestDto();
			reqAdd.auth_token = jwt_user1;
			reqAdd.user_to_white_list = user2.userId;

			const resAdd = await gameGateway.addPlayerToWhiteList(reqAdd);

			console.debug(`res: ${JSON.stringify(resAdd)}`);

			expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(1);
			expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);

			const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
			expect(resAdd).toEqual(expectedResAdd);

			/**
			 * Join the lobby
			 */

			const joinLobbySpy = jest.spyOn(gameGateway, 'joinRoom');

			const reqJoin = new JoinGameRoomRequestDto();
			reqJoin.auth_token = jwt_user2;
			reqJoin.game_room_id = game_room_id;

			const resJoin = await gameGateway.joinRoom(reqJoin);

			console.debug(`res: ${JSON.stringify(resJoin)}`);

			expect(joinLobbySpy).toHaveBeenCalledTimes(1);
			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);

			const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resJoin).toEqual(expectedResJoin);
		});

		it('should\'n join a lobby when the user is allready in a lobby', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const reqCreate = new CreateGameRoomRequestDto();
			reqCreate.auth_token = jwt_user1;

			const resCreate = await gameGateway.createMyRoom(reqCreate);

			console.debug(`res: ${JSON.stringify(resCreate)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);

			/**
			 * Add user2 to the whitelist
			 */

			const addPlayerToWhiteListSpy = jest.spyOn(gameGateway, 'addPlayerToWhiteList');

			const reqAdd = new addPlayerToWhiteListRequestDto();
			reqAdd.auth_token = jwt_user1;
			reqAdd.user_to_white_list = user2.userId;

			const resAdd = await gameGateway.addPlayerToWhiteList(reqAdd);

			console.debug(`res: ${JSON.stringify(resAdd)}`);

			expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(1);
			expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);

			const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
			expect(resAdd).toEqual(expectedResAdd);

			/**
			 * Join the lobby
			 */

			const joinLobbySpy = jest.spyOn(gameGateway, 'joinRoom');

			const reqJoin = new JoinGameRoomRequestDto();
			reqJoin.auth_token = jwt_user2;
			reqJoin.game_room_id = game_room_id;

			const resJoin = await gameGateway.joinRoom(reqJoin);

			console.debug(`res: ${JSON.stringify(resJoin)}`);

			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);

			const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resJoin).toEqual(expectedResJoin);

			/**
			 * Join the lobby again
			 */

			const reqJoin2 = new JoinGameRoomRequestDto();
			reqJoin2.auth_token = jwt_user2;
			reqJoin2.game_room_id = game_room_id;

			const resJoin2 = await gameGateway.joinRoom(reqJoin2);

			console.debug(`res: ${JSON.stringify(resJoin2)}`);

			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
			expect(joinLobbySpy).toHaveBeenCalledTimes(2);

			const expectedResJoin2 = new AcknowledgmentWsDto<string>('error', `User ${user2.userId} is already in a lobby ${game_room_id}`);
			expect(resJoin2).toEqual(expectedResJoin2);

			
		});

		it('should\'n join a lobby when the user is not in the whitelist', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const reqCreate = new CreateGameRoomRequestDto();
			reqCreate.auth_token = jwt_user1;

			const resCreate = await gameGateway.createMyRoom(reqCreate);

			console.debug(`res: ${JSON.stringify(resCreate)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);

			/**
			 * Join the lobby
			 */

			const joinLobbySpy = jest.spyOn(gameGateway, 'joinRoom');

			const reqJoin = new JoinGameRoomRequestDto();
			reqJoin.auth_token = jwt_user2;
			reqJoin.game_room_id = game_room_id;

			const resJoin = await gameGateway.joinRoom(reqJoin);

			console.debug(`res: ${JSON.stringify(resJoin)}`);

			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);

			const expectedResJoin = new AcknowledgmentWsDto<string>('error', `User ${user2.userId} is not in the white list of lobby ${game_room_id}`);
			expect(resJoin).toEqual(expectedResJoin);
		});

		async function addPlayerToWhiteList (userToAdd: any, userToAddJwt: any, roomOwer: any, roomOwerJwt: any, game_room_id: any,) {
			/**
			 * Add user to the whitelist
			 */

			const addPlayerToWhiteListSpy = jest.spyOn(gameGateway, 'addPlayerToWhiteList');

			const reqAdd = new addPlayerToWhiteListRequestDto();
			reqAdd.auth_token = roomOwerJwt;
			reqAdd.user_to_white_list = userToAdd.userId;

			const resAdd = await gameGateway.addPlayerToWhiteList(reqAdd);

			console.debug(`res: ${JSON.stringify(resAdd)}`);

			expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);

			return resAdd;

			// const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
			// expect(resAdd).toEqual(expectedResAdd);
		}

		async function joinPlayerToLobby (userToJoin: any, userToJoinJwt: any, game_room_id: any,) {
			/**
			 * Join the lobby
			 */

			const joinLobbySpy = jest.spyOn(gameGateway, 'joinRoom');

			const reqJoin = new JoinGameRoomRequestDto();
			reqJoin.auth_token = userToJoinJwt;
			reqJoin.game_room_id = game_room_id;

			const resJoin = await gameGateway.joinRoom(reqJoin);

			console.debug(`res: ${JSON.stringify(resJoin)}`);

			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);

			return resJoin;

			// const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
			// 	game_room_id: game_room_id,
			// });
			// expect(resJoin).toEqual(expectedResJoin);
		}

		async function addPlayerToWhiteListAndJoinIt(userToAdd: any, userToAddJwt: any, roomOwer: any, roomOwerJwt: any, game_room_id: any, expectedWhiteListRes: any, expectedJoinRes: any) {
			const resAdd = await addPlayerToWhiteList(userToAdd, userToAddJwt, roomOwer, roomOwerJwt, game_room_id);
			expect(resAdd).toEqual(expectedWhiteListRes);

			const resJoin = await joinPlayerToLobby(userToAdd, userToAddJwt, game_room_id);
			expect(resJoin).toEqual(expectedJoinRes);
		}
		
		//TODO Check game mode, 2, 4 players

		it('owner should be able to add 3 player to his lobby and player join', async () => {
			/**
			 * Make a lobby with 4 players
			 */

			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const reqCreate = new CreateGameRoomRequestDto();
			reqCreate.auth_token = jwt_user1;

			const resCreate = await gameGateway.createMyRoom(reqCreate);

			console.debug(`res: ${JSON.stringify(resCreate)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);

			await addPlayerToWhiteListAndJoinIt(user2,
				jwt_user2,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListAndJoinIt(user3,
				jwt_user3,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListAndJoinIt(user4,
				jwt_user4,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
		});

		it('should\'n not join more than 4 player in the lobby', async () => {
			/**
			 * Make a lobby with 4 players
			 */

			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			const reqCreate = new CreateGameRoomRequestDto();
			reqCreate.auth_token = jwt_user1;

			const resCreate = await gameGateway.createMyRoom(reqCreate);

			console.debug(`res: ${JSON.stringify(resCreate)}`);

			expect(createLobbySpy).toHaveBeenCalledTimes(1);
			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);

			await addPlayerToWhiteListAndJoinIt(user2,
				jwt_user2,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListAndJoinIt(user3,
				jwt_user3,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListAndJoinIt(user4,
				jwt_user4,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));

			/**
			 * Add user5 to the whitelist
			 */
			await addPlayerToWhiteListAndJoinIt(user5,
				jwt_user5,
				user1,
				jwt_user1,
				game_room_id,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<string>('error', `Lobby ${game_room_id} is full`)
			);
		});
	});

});