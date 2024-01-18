import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';


@Injectable()
export class IdManagerService {

	private readonly logger = new Logger(IdManagerService.name);


	//****************************************************************
	// Socket to User Cache Utils
	//****************************************************************

	private socketToUserCache: Map<
		number,	// UserId
		{
			// Primary SocketId and if it null it can be changed, if it not null it can't be changed
			primary: Socket | null,

			// SocketIds of the UserId
			ids: Array<Socket>,
			onDisconnect: (() => void) | null
		}
	> = new Map();

	/**
	 * Get the userId from a socket
	 * @param socket
	 * @returns userId or undefined if not found
	 */
	getUserIdFromSocketId(socketId: string): number | undefined {
		for (const [userId, value] of this.socketToUserCache.entries()) {
			const socket = value.ids.find(socket => socket.id === socketId);
			if (socket !== undefined){
				return userId;
			}
		}
		return undefined;
	}

	/**
	 * Get the primary socket for a user
	 * @param userId
	 * @returns primary socket or undefined if not found
	 */
	getUserPrimarySocket(userId: number): Socket | undefined {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			return undefined;
		}

		return user.primary;
	}

	/**
	 * Print all cache
	 * @warning Dont use JSON.stringify on the cache, it will crash
	 *          due to circular references with Socket object
	 */
	cacheToStr(){
		try {
			let cache = 'Cache: \n';
			for (const [userId, value] of this.socketToUserCache.entries()) {
				cache += `userId: ${userId} \n`;
				cache += `primary: ${value?.primary?.id} \n`;
				cache += `ids: ${value?.ids?.map(s => s?.id)} \n`;
				cache += `onDisconnect: ${value?.onDisconnect} \n`;
			}
			return cache;

		} catch (error) {
			this.logger.error(`Error while printing cache: ${error}`);
		}
		return 'Error while printing cache';
	}


	//****************************************************************
	// User to Socket Cache
	//****************************************************************

	async connect(socket: Socket, userId: number){

		// Check if user is already connected
		const user = this.socketToUserCache.get(userId);

		// If not create new user
		if (user === undefined){
			this.socketToUserCache.set(userId, {
				primary: null,
				ids: [socket],
				onDisconnect: null
			});
			this.logger.debug(`New first socket ${socket.id} stored in cache for user ${userId}`)
			this.logger.verbose(this.cacheToStr());
			return;
		}

		// If user is already connected add socket ids
		user.ids.push(socket);
		this.logger.debug(`New socket ${socket.id} stored in cache for user ${userId}`)
		this.logger.verbose(this.cacheToStr());
	}

	async disconnect(socket: Socket){
		const userId = this.getUserIdFromSocketId(socket.id);

		if (userId === undefined){
			this.logger.warn(`No user found for socket ${socket.id} disconnection!?`);
			return;
		}

		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.warn(`Undefined user for socket ${socket.id} disconnection!?`);
			return;
		}

		// If the socket was the primary socket, set the primary socket to null
		if (user.primary?.id === socket.id) {
			// Call onDisconnect callback if set
			try {
				await user.onDisconnect?.();
			} catch (error) {
				this.logger.error(`Error while calling onDisconnect callback for user ${userId}: ${error}`);
			}
			this.unsetOnDisconnectCallback(userId);
			user.primary = null;
		}

		// Remove socket from user from ids
		user.ids = user.ids.filter(s => s.id !== socket.id);
		this.logger.debug(`Socket ${socket.id} removed from cache for user ${userId}`)
		this.logger.verbose(this.cacheToStr());
	}

	/**
	 * Set callback on primary socket disconnection
	 * @param callback()
	 * @throws NotFoundException if user not found
	 */
	async setOnDisconnectCallback(userId: number, callback: () => void){
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null){
			this.logger.verbose(`No primary socket for user ${userId}, ignoring and set the callback`);
		}

		if (user.onDisconnect !== null){
			this.logger.verbose(`onDisconnect callback already set for user ${userId}, overriding`);
		}

		user.onDisconnect = callback;
		return;
	}

	/**
	 * Unset callback on primary socket disconnection
	 * @param userId
	 * @throws NotFoundException if user not found
	 */
	async unsetOnDisconnectCallback(userId: number){
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null){
			this.logger.verbose(`No primary socket for user ${userId}, ignoring and unset the callback`);
		}

		if (user.onDisconnect === null){
			this.logger.verbose(`onDisconnect callback already unset for user ${userId}, ignoring`);
		}

		user.onDisconnect = null;
		return;
	}

	/**
	 * Subscribe primary user socket to a room
	 * @param userId
	 * @throws NotFoundException if user not found
	 * @throws NotFoundException if no primary socket found
	 */
	async subscribePrimaryUserToRoom(userId: number, room: string){
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null){
			this.logger.warn(`No primary socket for user ${userId} to subscribe to room ${room}, ignoring`);
			throw new NotFoundException(`No primary socket for user ${userId} to subscribe to room ${room}`);
		}

		user.primary.join(room);
		return;
	}

	/**
	 * Unsubscribe primary user socket to a room
	 * @param userId
	 * @throws NotFoundException if user not found
	 * @throws NotFoundException if no primary socket found
	 */
	async unsubscribePrimaryUserToRoom(userId: number, room: string){
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			this.logger.error(`HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null){
			this.logger.error(`HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
			this.logger.warn(`No primary socket for user ${userId} to unsubscribe to room ${room}, ignoring`);
			throw new NotFoundException(`No primary socket for user ${userId} to unsubscribe to room ${room}`);
		}

		user.primary.leave(room);
		return;
	}

	/**
	 * Execute a primary action
	 * @warning If the primary socket is not set the for the user
	 * it will set with the given socket
	 * @param socket 
	 * @param userId
	 * @param func The function to execute if the socket is the primary socket
	 * @throws NotFoundException if user not found
	 * @throws UnauthorizedException if the socket is not the primary socket
	 * @returns The result of the function
	 */
	async executePrimaryAction<T>(socket: Socket, userId: number, func: () => Promise<T>): Promise<T> {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null){
			throw new NotFoundException(`No primary socket for user ${userId}, set to ${socket.id}`);
		}

		if (user?.primary.id !== socket.id){
			this.logger.debug(`Socket ${socket.id} is not the primary socket for user ${userId}`);
			throw new UnauthorizedException(`You are already perfoming an action from another device`);
		}
		return func();
	}

	// A secondary action is an action that can be executed anytime by anyone
	async executeSecondaryAction<T>(socket: Socket, userId: number, func: () => Promise<T>): Promise<T>{
		return func()
	}

	/**
	 * Set the primary socket for a user
	 * @param userId
	 * @param socketId
	 */
	setUserPrimarySocket(socket: Socket, userId: number) {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (socket === undefined){
			this.logger.debug(`Socket ${socket.id} not found in cache for user ${userId}`);
			throw new NotFoundException(`Socket ${socket.id} not found for user ${userId}`);
		}

		if (user.primary !== null && user.primary.id !== socket.id) {
			this.logger.warn(`Primary socket for user ${userId} already set`);
			throw new NotFoundException(`You can't execute this action from another device`);
		}

		user.primary = socket;
		this.logger.verbose(`Primary socket for user ${userId} set to ${socket.id}`);
	}

	/**
	 * Reset the primary socket for a user
	 * @param userId
	 * @param socketId
	 * @throws NotFoundException if user not found
	 */
	async resetUserPrimarySocket(userId: number) {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary === null) {
			this.logger.warn(`There is no primary socket for user ${userId} to reset, ignoring`);
			return;
		}

		this.logger.verbose(`Reset primary socket for user ${userId} from ${user.primary.id}`);
		user.primary = null;
	}

}