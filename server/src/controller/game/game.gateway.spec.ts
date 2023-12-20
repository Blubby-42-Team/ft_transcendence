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

	/**
	 * Create a lobby for the user
	 * @param userJwt user jwt
	 * @returns createGameRoomResponse aknowledgment
	 * @warning This function call the gatewayGameService.createMyRoom but dont check the response
	 * You should check the response in the test
	 */
	async function createMyRoom(userJwt: any) {
		/**
		 * Create a lobby
		 */
		const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

		const reqCreate = new CreateGameRoomRequestDto();
		reqCreate.auth_token = userJwt;

		const resCreate = await gameGateway.createMyRoom(reqCreate);

		console.debug(`res: ${JSON.stringify(resCreate)}`);

		expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

		return resCreate;
	}

	async function addPlayerToWhiteListAndCheck (userToAdd: number, roomOwnerJwt: any) {
		/**
		 * Add user to the whitelist
		 */

		const addPlayerToWhiteListSpy = jest.spyOn(gameGateway, 'addPlayerToWhiteList');

		const reqAdd = new addPlayerToWhiteListRequestDto();
		reqAdd.auth_token = roomOwnerJwt;
		reqAdd.user_to_white_list = userToAdd;

		const resAdd = await gameGateway.addPlayerToWhiteList(reqAdd);

		console.debug(`res: ${JSON.stringify(resAdd)}`);

		expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);

		return resAdd;

		// const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
		// expect(resAdd).toEqual(expectedResAdd);
	}

	/**
	 * Try to join user to the lobby
	 * @param userToJoinJwt user jwt
	 * @param game_room_id lobby id to join
	 * @returns joinGameResponse aknowledgment
	 * @warning This function call the gatewayGameService.joinRoom but dont check the response
	 * You should check the response in the test
	 */
	async function joinPlayerToLobby (userToJoinJwt: any, game_room_id: any,) {
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

	async function addPlayerToWhiteListJoinItAndCheck(
		game_room_id: any,
		userIdToAdd: number,
		userToAddJwt: any,
		roomOwnerJwt: any,
		expectedWhiteListRes: any,
		expectedJoinRes: any
	) {
		const resAdd = await addPlayerToWhiteListAndCheck(userIdToAdd, roomOwnerJwt);
		expect(resAdd).toEqual(expectedWhiteListRes);

		const resJoin = await joinPlayerToLobby(userToAddJwt, game_room_id);
		expect(resJoin).toEqual(expectedJoinRes);
	}

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
		it('Should create a lobby for ownerUser', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const res = await createMyRoom(jwt_user1);

			// Should return a success acknowledgment
			const expectedRes = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: res?.message?.game_room_id,
			});
			expect(res).toEqual(expectedRes);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);
		});

		it('Should not create duplicate lobby when ownerUser allready have one', async () => {
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// 1st call to create a lobby
			const res1 = await createMyRoom(jwt_user1);

			// Should return a success acknowledgment
			const expectedRes1 = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: res1?.message?.game_room_id,
			});
			expect(res1).toEqual(expectedRes1);

			// 2nd call to create a lobby
			const res2 = await createMyRoom(jwt_user1);

			// Should return an error
			const expectedRes2 = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is allready in the lobby ${res1?.message?.game_room_id}`);
			expect(res2).toEqual(expectedRes2);
			expect(createLobbySpy).toHaveBeenCalledTimes(2);
		});

	});

	describe('joinRoom' , () => {
		it('Should\'n let ownerUser to join his own lobby', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			const game_room_id = resCreate?.message?.game_room_id;

			// Should return a success acknowledgment
			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

			/**
			 * Join the lobby
			 */


			const resJoin = await joinPlayerToLobby(jwt_user1, game_room_id);

			console.debug(`res: ${JSON.stringify(resJoin)}`);

			const expectedResJoin = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is the owner of the lobby ${game_room_id}`);
			expect(resJoin).toEqual(expectedResJoin);
		});

		it('Should add to white list and join guestUser in the ownerUser lobby', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			// Should return a success acknowledgment
			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: resCreate?.message?.game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

			/**
			 * Add user2 to the whitelist and join the lobby
			 */

			addPlayerToWhiteListJoinItAndCheck(
				resCreate?.message?.game_room_id,
				user2.userId,
				jwt_user2,
				jwt_user1,
				// Should successfull add user2 to the whitelist
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				// Should successfull join user2 to the lobby
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				}
			));
		});

		it('should\'n allow guest to join tiwce a lobby ', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

			/**
			 * Add user2 to the whitelist and join the lobby
			 */

			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user2.userId,
				jwt_user2,
				jwt_user1,
				// Should successfull add user2 to the whitelist
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				// Should successfull join user2 to the lobby
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));

			/**
			 * Join the lobby again
			 * Should return an error
			 */
			const resJoin = await joinPlayerToLobby(jwt_user2, game_room_id);

			const expectedResJoin2 = new AcknowledgmentWsDto<string>('error', `User ${user2.userId} is already in the lobby ${game_room_id}`);
			expect(resJoin).toEqual(expectedResJoin2);
		});

		it('should\'n allow a guest to join a lobby whitout be in the whitelist', async () => {
			/**
			 * Create a lobby
			 */
			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			const game_room_id = resCreate?.message?.game_room_id;

			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

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
	
		//TODO Check game mode, 2, 4 players

		it('owner should be able to add and join 3 player to his lobby', async () => {
			/**
			 * Make a lobby with 4 players
			 */

			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			// Should return a success acknowledgment
			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: resCreate?.message?.game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

			const game_room_id = resCreate?.message?.game_room_id;

			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user2.userId,
				jwt_user2,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user3.userId,
				jwt_user3,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user4.userId,
				jwt_user4,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
		});

		it('should not join more than 4 player in the lobby', async () => {
			/**
			 * Make a lobby with 4 players
			 */

			const createLobbySpy = jest.spyOn(gameGateway, 'createMyRoom');

			// Should create a lobby
			const resCreate = await createMyRoom(jwt_user1);

			// Should return a success acknowledgment
			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
				game_room_id: resCreate?.message?.game_room_id,
			});
			expect(resCreate).toEqual(expectedResCreate);
			expect(createLobbySpy).toHaveBeenCalledTimes(1);

			const game_room_id = resCreate?.message?.game_room_id;

			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user2.userId,
				jwt_user2,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user3.userId,
				jwt_user3,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));
			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user4.userId,
				jwt_user4,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<joinGameResponse>('ok', {
					game_room_id: game_room_id,
				}
			));

			/**
			 * Add user5 to the whitelist
			 * Should return an error
			 */
			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user5.userId,
				jwt_user5,
				jwt_user1,
				new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
				new AcknowledgmentWsDto<string>('error', `Lobby ${game_room_id} is full`)
			);
		});
	});

});