import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from '../game.gateway';
import { GatewayGameService } from '../gateway.game.service';

import * as jwt from 'jsonwebtoken';
import { ModelGameModule } from 'src/model/game/game.module';
import { ModelGameService } from 'src/model/game/game.service';
import { AcknowledgmentWsDto, CreateGameRoomRequestDto, JoinGameRoomRequestDto, addOrRemovePlayerToWhiteListResponse, addPlayerToWhiteListRequestDto, createGameRoomResponse, joinGameResponse } from '@shared/dto/ws.dto';
import { PostgresModule } from 'src/service/postgres/postgres.module';
import { GameModule } from 'src/service/game/game.module';
import { ControllerGameModule } from '../game.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

describe('createMyGame', () => {
	
	const logger = new Logger(`${GameGateway.name} test`);

	let gameGateway: GameGateway;
	let gatewayGameService: GatewayGameService;
	let configService: ConfigService;

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
				ConfigService,
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
		configService = module.get<ConfigService>(ConfigService);
		

		/**
		 * JWTs for testing
		 * secret: 'secret'
		 */
		// const secret = 'secret';
		const secret = configService.get<string>('JWT_SECRET');
		
		jwt_user1 = jwt.sign(user1, secret)
		jwt_user2 = jwt.sign(user2, secret)
		jwt_user3 = jwt.sign(user3, secret)
		jwt_user4 = jwt.sign(user4, secret)
		jwt_user5 = jwt.sign(user5, secret)
	});

	/**
	 * Create socket with jwt authorization header
	 */
	function socketWithJwtHeader(jwt: string) {
		return {
			handshake: {
				headers: {
					authorization: jwt,
				}
			}
		} as Socket;
	}

	/**
	 * Create a lobby for the user
	 * @param userJwt user jwt
	 * @param checkCallBack callback to check the response
	 * @warning This function call the gatewayGameService.createMyRoom but dont check the response
	 * You should check the response by yourself in the callback 
	 * @returns checkCallBack return
	 */
	async function createMyRoomAndCheck(
		userJwt: any,
		checkCallBack: (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbyspy: any) => any)
	{

		if (!checkCallBack) {
			logger.warn('checkCallBack is not defined');
			logger.warn('You should check the response by yourself in the callback');
		};
		/**
		 * Create a lobby
		 */
		const createLobbySpy = jest.spyOn(gameGateway, 'createMyGame');

		const reqSock = socketWithJwtHeader(userJwt);

		const reqCreate = new CreateGameRoomRequestDto();

		const resCreate = await gameGateway.createMyGame(reqCreate, reqSock);

		logger.debug(`res: ${JSON.stringify(resCreate)}`);

		return checkCallBack(reqCreate, resCreate, createLobbySpy);
	}

	/**
	 * Create a lobby for the user
	 * @param userToAdd user to add to the whitelist
	 * @param roomOwnerJwt owner of the lobby jwt
	 * @param checkCallBack callback to check the response
	 * @warning This function call the gatewayGameService.addPlayerToWhiteList but dont check the response
	 * You should check the response by yourself in the callback 
	 * @returns checkCallBack return
	 */
	async function addPlayerToWhiteListAndCheck (
		userToAdd: number,
		roomOwnerJwt: any,
		checkCallBack: (reqAdd: addPlayerToWhiteListRequestDto, resAdd: any, addPlayerToWhiteListSpy: any) => any)
	{

		if (!checkCallBack) {
			logger.warn('checkCallBack is not defined');
			logger.warn('You should check the response by yourself in the callback');
		}

		/**
		 * Add user to the whitelist
		 */

		const addPlayerToWhiteListSpy = jest.spyOn(gameGateway, 'addPlayerToMyGame');

		const reqSock = socketWithJwtHeader(roomOwnerJwt);

		const reqAdd = new addPlayerToWhiteListRequestDto();
		reqAdd.user_to_white_list = userToAdd;

		const resAdd = await gameGateway.addPlayerToMyGame(reqAdd, reqSock);

		return checkCallBack(reqAdd, resAdd, addPlayerToWhiteListSpy);
	}

	/**
	 * Try to join user to the lobby
	 * @param userToJoinJwt user jwt
	 * @param game_room_id lobby id to join
	 * @param checkCallBack callback to check the response
	 * @returns checkCallBack return
	 * @warning This function call the gatewayGameService.joinRoom but dont check the response
	 * You should check the response by yourself in the callback 
	 */
	async function joinPlayerToLobbyAndCheck (
		userToJoinJwt: any,
		game_room_id: any,
		checkCallBack: (reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => any)
	{

		if (!checkCallBack) {
			logger.warn('checkCallBack is not defined');
			logger.warn('You should check the response by yourself in the callback');
		}

		/**
		 * Join the lobby
		 */

		const joinLobbySpy = jest.spyOn(gameGateway, 'joinGame');

		const reqJoin = new JoinGameRoomRequestDto();
		reqJoin.game_room_id = game_room_id;

		const reqSock = socketWithJwtHeader(userToJoinJwt);

		const resJoin = await gameGateway.joinGame(reqJoin, reqSock);

		return checkCallBack(reqJoin, resJoin, joinLobbySpy);
	}

	/**
	 * Add a user to the whitelist and join the lobby
	 * @param game_room_id Room id to join
	 * @param userIdToAdd User to add to the whitelist
	 * @param userToAddJwt User to add jwt
	 * @param roomOwnerJwt Owner of the lobby jwt
	 * @param checkCallBackWhiteList callback to check the response of the addPlayerToWhiteList
	 * @param checkCallBackJoin callback to check the response of the joinPlayerToLobby
	 * @param returnFormatterCallBack callback to format the return
	 * @returns returnFormatterCallBack return if defined else undefined
	 * 
	 */
	async function addPlayerToWhiteListJoinItAndCheck(
		game_room_id: any,
		userIdToAdd: number,
		userToAddJwt: any,
		roomOwnerJwt: any,
		checkCallBackWhiteList: (reqAdd: addPlayerToWhiteListRequestDto, resAdd: any, addPlayerToWhiteListSpy: any) => any,
		checkCallBackJoin: (reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => any,
		returnFormatterCallBack?: (resAdd: any, resJoin: any) => any
	)
	{
		const resAdd = await addPlayerToWhiteListAndCheck(userIdToAdd, roomOwnerJwt, checkCallBackWhiteList);
		const resJoin = await joinPlayerToLobbyAndCheck(userToAddJwt, game_room_id, checkCallBackJoin);
		
		return returnFormatterCallBack ? returnFormatterCallBack(resAdd, resJoin) : undefined;
	}

	it('should be defined', () => {
		expect(gameGateway).toBeDefined();
	});







	/**
	 * Test connection and disconnection
	 */

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







	/**
	 * Test createMyGame
	 */

	describe('createMyGame', () => {
		it('Should create a lobby for ownerUser', async () => {
			// Should create a lobby
			const res = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {

				// Should return a success acknowledgment
				const expectedRes = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				});
				
				// expect(createLobbySpy).toHaveBeenCalledWith(reqCreate)
				expect(resCreate).toEqual(expectedRes);
				// expect(createLobbySpy).toHaveBeenCalledTimes(1);
			});
		});

		it('Should not create duplicate lobby when ownerUser allready have one', async () => {

			// 1st call to create a lobby
			const game_room_id = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
				// Should return a success acknowledgment
				const expectedRes1 = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				});
				// expect(resCreate).toEqual(expectedRes1);
				// expect(createLobbySpy).toHaveBeenCalledTimes(1);
				 return resCreate?.message?.game_room_id;
			});

			// 2nd call to create a lobby
			await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
				// Should return an error
				const expectedRes2 = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is allready in the lobby ${game_room_id}`);
				expect(resCreate).toEqual(expectedRes2);
				// expect(createLobbySpy).toHaveBeenCalledTimes(2);
			});
		});

	});






	/**
	 * Test joinGame
	 */

	describe('joinGame' , () => {
		it('Should\'n let ownerUser to join his own lobby', async () => {

			/**
			 * Create a lobby
			 */

			// Should create a lobby
			const game_room_id = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
				// Should return a success acknowledgment
				const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				});
				expect(resCreate).toEqual(expectedResCreate);
				// expect(createLobbySpy).toHaveBeenCalledTimes(1);

				return resCreate?.message?.game_room_id;
			});

			/**
			 * Join the lobby
			 */

			await joinPlayerToLobbyAndCheck(jwt_user1, game_room_id, (reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {
				
				// Should return an error
				const expectedResJoin = new AcknowledgmentWsDto<string>('error', `User ${user1.userId} is the owner of the lobby ${game_room_id}`);
				expect(resJoin).toEqual(expectedResJoin);
				// expect(joinLobbySpy).toHaveBeenCalledTimes(1);

			});
		});

		it('Should add to white list and join guestUser in the ownerUser lobby', async () => {
			/**
			 * Create a lobby
			 */

			// Should create a lobby
			const game_room_id = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
				// Should return a success acknowledgment
				const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				});
				expect(resCreate).toEqual(expectedResCreate);
				// expect(createLobbySpy).toHaveBeenCalledTimes(1);

				return resCreate?.message?.game_room_id;
			});

			/**
			 * Add user2 to the whitelist and join the lobby
			 */

			await addPlayerToWhiteListJoinItAndCheck(
				game_room_id,
				user2.userId,
				jwt_user2,
				jwt_user1,
				// Should successfull add user2 to the whitelist
				(reqAdd, resAdd, addPlayerToWhiteListSpy) => {
					const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
					expect(resAdd).toEqual(expectedResAdd);
					// expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);
					// expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(1);
				},
				// Should successfull join user2 to the lobby
				(reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {
					const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
						game_room_id: reqJoin.game_room_id,
					});
					expect(resJoin).toEqual(expectedResJoin);
					// expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
					// expect(joinLobbySpy).toHaveBeenCalledTimes(1);
				}
			);
		})

	}); // End of joinRoom describe


		//TODO Rework this test after #36
		// 	/**
		// 	 * Create a lobby
		// 	 */

		// 	// Should create a lobby
		// 	const game_room_id = await createMyRoomAndCheck(
		// 		jwt_user1,
		// 		(reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
		// 			const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
		// 				game_room_id: resCreate?.message?.game_room_id,
		// 			});

		// 			expect(resCreate).toEqual(expectedResCreate);
					// expect(createLobbySpy).toHaveBeenCalledTimes(1);
		// 			expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

		// 			return resCreate?.message?.game_room_id;
		// 	});

		// 	/**
		// 	 * Add user2 to the whitelist and join the lobby
		// 	 */

		// 	await addPlayerToWhiteListJoinItAndCheck(
		// 		game_room_id,
		// 		user2.userId,
		// 		jwt_user2,
		// 		jwt_user1,
		// 		// Should successfull add user2 to the whitelist
		// 		new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok'),
		// 		// Should successfull join user2 to the lobby
		// 		new AcknowledgmentWsDto<joinGameResponse>('ok', {
		// 			game_room_id: game_room_id,
		// 		}
		// 	));

		// 	/**
		// 	 * Join the lobby again
		// 	 * Should return an error
		// 	 */
		// 	const resJoin = await joinPlayerToLobby(jwt_user2, game_room_id);

		// 	const expectedResJoin2 = new AcknowledgmentWsDto<string>('error', `User ${user2.userId} is already in the lobby ${game_room_id}`);
		// 	expect(resJoin).toEqual(expectedResJoin2);
		// });

		it('should\'n allow a guest to join a lobby whitout be in the whitelist', async () => {
			/**
			 * Create a lobby
			 */

			// Should create a lobby
			const game_room_id = await createMyRoomAndCheck(
				jwt_user1,
				(reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
					const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
						game_room_id: resCreate?.message?.game_room_id,
					});

					expect(resCreate).toEqual(expectedResCreate);
					// expect(createLobbySpy).toHaveBeenCalledTimes(1);
					// expect(createLobbySpy).toHaveBeenCalledWith(reqCreate);

					return resCreate?.message?.game_room_id;
			});

			/**
			 * Join the lobby
			 */

			// Should return an error
			await joinPlayerToLobbyAndCheck(
				jwt_user2,
				game_room_id,
				(reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {

					const expectedResJoin = new AcknowledgmentWsDto<string>('error', `User ${user2.userId} is not in the white list of lobby ${game_room_id}`);

					expect(resJoin).toEqual(expectedResJoin);
					// expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
					// expect(joinLobbySpy).toHaveBeenCalledTimes(1);

					return resJoin;
			});
		});
	
		//TODO Check game mode, 2, 4 players

		it('owner should be able to add and join 3 player to his lobby', async () => {
			/**
			 * Create a lobby
			 */

			// Should create a lobby
			const game_room_id = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
				// Should return a success acknowledgment
				const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
					game_room_id: resCreate?.message?.game_room_id,
				});
				expect(resCreate).toEqual(expectedResCreate);
				// expect(createLobbySpy).toHaveBeenCalledTimes(1);

				return resCreate?.message?.game_room_id;
			});

			/**
			 * Add 3 player to the whitelist and join the lobby
			 */

			const addPlayerTestArray = [
				{
					user: user2,
					jwt: jwt_user2,
				},
				{
					user: user3,
					jwt: jwt_user3,
				},
				{
					user: user4,
					jwt: jwt_user4,
				},
			];

			addPlayerTestArray.forEach(async (addPlayerTest) => {
				await addPlayerToWhiteListJoinItAndCheck(
					game_room_id,
					addPlayerTest.user.userId,
					addPlayerTest.jwt,
					jwt_user1,
					// Should successfull add user2 to the whitelist
					(reqAdd, resAdd, addPlayerToWhiteListSpy) => {
						const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
						expect(resAdd).toEqual(expectedResAdd);
						// expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);
						// expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(1);
					},
					// Should successfull join user2 to the lobby
					(reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {
						const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
							game_room_id: reqJoin.game_room_id,
						});
						expect(resJoin).toEqual(expectedResJoin);
						// expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
						// expect(joinLobbySpy).toHaveBeenCalledTimes(1);
					},
				);
			});
		});


		//TODO Remove this test after #36
		// it('should not join more than 4 player in the lobby', async () => {
		// 	/**
		// 	 * Create a lobby
		// 	 */

		// 	// Should create a lobby
		// 	const game_room_id = await createMyRoomAndCheck(jwt_user1, (reqCreate: CreateGameRoomRequestDto, resCreate: any, createLobbySpy: any) => {
				
		// 		// Should return a success acknowledgment
		// 		const expectedResCreate = new AcknowledgmentWsDto<createGameRoomResponse>('ok', {
		// 			game_room_id: resCreate?.message?.game_room_id,
		// 		});
		// 		expect(resCreate).toEqual(expectedResCreate);
				// expect(createLobbySpy).toHaveBeenCalledTimes(3);

		// 		return resCreate?.message?.game_room_id;
		// 	});

		// 	/**
		// 	 * Add 3 player to the whitelist and join the lobby
		// 	 */

		// 	const addPlayerTestArray = [
		// 		{
		// 			user: user2,
		// 			jwt: jwt_user2,
		// 		},
		// 		{
		// 			user: user3,
		// 			jwt: jwt_user3,
		// 		},
		// 		{
		// 			user: user4,
		// 			jwt: jwt_user4,
		// 		},
		// 	];

		// 	addPlayerTestArray.forEach(async (addPlayerTest) => {
		// 		await addPlayerToWhiteListJoinItAndCheck(
		// 			game_room_id,
		// 			addPlayerTest.user.userId,
		// 			addPlayerTest.jwt,
		// 			jwt_user1,
		// 			// Should successfull add user2 to the whitelist
		// 			(reqAdd, resAdd, addPlayerToWhiteListSpy) => {
		// 				const expectedResAdd = new AcknowledgmentWsDto<addOrRemovePlayerToWhiteListResponse>('ok', 'ok');
		// 				expect(resAdd).toEqual(expectedResAdd);
		// 				expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);
						// expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(3);
		// 			},
		// 			// Should successfull join user2 to the lobby
		// 			(reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {
		// 				const expectedResJoin = new AcknowledgmentWsDto<joinGameResponse>('ok', {
		// 					game_room_id: reqJoin.game_room_id,
		// 				});
		// 				expect(resJoin).toEqual(expectedResJoin);
		// 				expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
						// expect(joinLobbySpy).toHaveBeenCalledTimes(3);
		// 			},
		// 		);
		// 	});

		// 	/**
		// 	 * Try to add a 5th player to the whitelist and join the lobby
		// 	 */

		// 	// Should return an error
		// 	await addPlayerToWhiteListJoinItAndCheck(
		// 		game_room_id,
		// 		user5.userId,
		// 		jwt_user5,
		// 		jwt_user1,
		// 		// Should successfull add user2 to the whitelist
		// 		(reqAdd, resAdd, addPlayerToWhiteListSpy) => {
		// 			const expectedResAdd = new AcknowledgmentWsDto<joinGameResponse>('ok', {
		// 				game_room_id: game_room_id,
		// 			});
		// 			expect(resAdd).toEqual(expectedResAdd);
		// 			expect(addPlayerToWhiteListSpy).toHaveBeenCalledWith(reqAdd);
					// expect(addPlayerToWhiteListSpy).toHaveBeenCalledTimes(4);
		// 		},
		// 		// Should successfull join user2 to the lobby
		// 		(reqJoin: JoinGameRoomRequestDto, resJoin: any, joinLobbySpy: any) => {
		// 			const expectedResJoin = new AcknowledgmentWsDto<any>('error', `Lobby ${game_room_id} is full`);
		// 			expect(resJoin).toEqual(expectedResJoin);
		// 			expect(joinLobbySpy).toHaveBeenCalledWith(reqJoin);
					// expect(joinLobbySpy).toHaveBeenCalledTimes(4);
		// 		},
		// 	);

		// });

	}); // End of joinRoom describe