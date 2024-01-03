import { io, Socket } from "socket.io-client";

export class SocketClient {
	protected socket: Socket | null = null;

	constructor(namespace: string) {
		if (process.server){
		}
		else if(process.client && this.socket){
			const config = useRuntimeConfig();
			this.socket = io(`${config.public.back.ws}/${namespace}`, {
				withCredentials: true
			});
	
			this.socket.on('connect', () => {
				console.log('Socket.io User connected');
			});
	
			this.socket.on('disconnect', () => {
				console.log('Socket.io User disconnected');
			});
		}
	}

	public emit<T>(eventName: string, body: T){
		if (process.server){
		}
		else if(process.client && this.socket){
			this.socket.emit(eventName, body);
		}
	}

	public on<T>(eventName: string, callback: (data: T) => void){
		if (process.server){
		}
		else if(process.client && this.socket){
			this.socket.on(eventName, callback);
		}
	}
};