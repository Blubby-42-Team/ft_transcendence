import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class IdManagerService {

	private map: Map<
		string,	// UserId
		{
			// Primary SocketId and if it null it can be changed, if it not null it can't be changed
			primary: Socket | null,

			// SocketIds of the UserId
			ids: Array<Socket> 
		}
	>;

	// executePrimaryAction(func: () => {}){
	// 	if // primary{
	// 		func();

	// 	}
	// 	te
	// }
}