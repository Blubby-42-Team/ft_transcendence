import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';


@Injectable()
export class IdManagerService {

	private readonly logger = new Logger(IdManagerService.name);


	/****************************************************************/
	/* Socket to User Cache Utils
	/****************************************************************/

	private socketToUserCache: Map<
		number,	// UserId
		{
			// Primary SocketId and if it null it can be changed, if it not null it can't be changed
			primary: Socket | null,

			// SocketIds of the UserId
			ids: Array<Socket> 
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
	 * Print all cache
	 * @warning Dont use JSON.stringify on the cache, it will crash
	 *          due to circular references with Socket object
	 */
	cacheToStr(){
		let cache = 'Cache: \n';
		for (const [userId, value] of this.socketToUserCache.entries()) {
			cache += `userId: ${userId} \n`;
			cache += `primary: ${value.primary?.id} \n`;
			cache += `ids: ${value.ids.map(s => s.id)} \n`;
		}
		return cache;
	}


	/****************************************************************/
	/* User to Socket Cache
	/****************************************************************/

	connect(socket: Socket, userId: number){

		// Check if user is already connected
		const user = this.socketToUserCache.get(userId);

		// If not create new user
		if (user === undefined){
			this.socketToUserCache.set(userId, {
				primary: null,
				ids: [socket]
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

	disconnect(socket: Socket){
		const userId = this.getUserIdFromSocketId(socket.id);

		if (userId === undefined){
			this.logger.warn(`No user found for socket ${socket.id} disconnection!?`);
			return;
		}

		// Remove socket from user
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.warn(`Undefined user for socket ${socket.id} disconnection!?`);
			return;
		}

		// If the socket was the primary socket, set the primary socket to null
		user.primary = null;

		// Remove socket from user from ids
		user.ids = user.ids.filter(s => s.id !== socket.id);
		this.logger.debug(`Socket ${socket.id} removed from cache for user ${userId}`)
		this.logger.verbose(this.cacheToStr());
	}

	// A primary action is an action that can be executed while your are the primary socket
	// will block if call by a secondary socket
	/**
	 * Execute a primary action
	 * @param socket 
	 * @param userId
	 * @param func The function to execute if the socket is the primary socket
	 * @returns The result of the function
	 */
	async executePrimaryAction<T>(socket: Socket, userId: number, func: () => Promise<T>) {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		// If the socket is not the primary socket, block
		if (user?.primary.id !== socket.id){
			this.logger.debug(`Socket ${socket.id} is not the primary socket for user ${userId}`);
			throw new UnauthorizedException(`You are already perfoming an action from another device`);
		}
		return func();
	}

	// A secondary action is an action that can be executed anytime by anyone
	executeSecondaryAction<T>(socket: Socket, userId: number, func: () => Promise<T>){
		return func()
	}

	/**
	 * Reset the primary socket for a user
	 * @param userId
	 * @param socketId
	 */
	resetUserPrimarySocket(socket: Socket, userId: number) {
		const user = this.socketToUserCache.get(userId);

		if (user === undefined){
			this.logger.debug(`User ${userId} not found in cache`);
			throw new NotFoundException(`User ${userId} not found`);
		}

		if (user.primary?.id !== null) {
			this.logger.warn(`No primary socket for user ${userId} to reset, ignoring`);
			return;
		}

		user.primary = null;
	}
}