import { io, Socket } from "socket.io-client";

export class SocketClient {
	protected socket: Socket | null = null;

	constructor(namespace: string) {
		if (process.server){
			return ;
		}
		console.log(`Socket.io ${namespace} connecting`)
		const config = useRuntimeConfig();
		this.socket = io(`${config.public.back.ws}/${namespace}`, {
			withCredentials: true
		});

		this.socket.on(`connect`, () => {
			console.log(`Socket.io ${namespace} connected`);
		});

		this.socket.on(`disconnect`, () => {
			console.log(`Socket.io ${namespace} disconnected`);
		});
	}

	public async emit(eventName: string, body: Object) {
		if (!this.socket){
			return ;
		}
		this.socket!.emit(eventName, body);
	}

	public async request<Res>(eventName: string, body: Object): Promise<Res | undefined> {
		if (!this.socket){
			return ;
		}
		return new Promise<Res>((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Socket.io timeout: No response received within 5 seconds'));
			}, 5000);
			this.socket!.emit(eventName, body, (res: Res) => {
				clearTimeout(timeoutId);
				resolve(res);
			});
		});
	}

	public on<T>(eventName: string, callback: (data: T) => void){
		if (!this.socket){
			return ;
		}
		this.socket.on(eventName, callback);
	}
};