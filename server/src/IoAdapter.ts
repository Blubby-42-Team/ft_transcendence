import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
private io: Server;

constructor(io: Server) {
	super();
	this.io = io;
}

createIOServer(port: number, options?: any): any {
	return this.io;
}
}
