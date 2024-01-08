import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class IdManagerService {

	private socketToUserCache: Map<
		number,	// UserId
		{
			// Primary SocketId and if it null it can be changed, if it not null it can't be changed
			primary: Socket | null,

			// SocketIds of the UserId
			ids: Array<Socket> 
		}
	>;

	connect(socket: Socket, userId: number){
		
	}

	disconnect(socket: Socket){

	}

	// A primary action is an action that can be executed while your are the primary socket
	// will block if call by a secondary socket
	executePrimaryAction(socket: Socket, userId: number, func: () => {}){
		func()
	}

	// A secondary action is an action that can be executed anytime by anyone
	executeSecondaryAction(socket: Socket, userId: number, func: () => {}){
		func()
	}
}