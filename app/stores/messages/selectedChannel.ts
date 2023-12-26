export const useChannelStore = defineStore('channel', {
	state: (): {
		_channel		: IChannel;
		_members		: Array<IPlayer>;
		_messages		: Array<IMessage>;
	} => ({
		_channel: {	id: 1,	type: 1,	name: 'Chats 1'	},
		_members: [
			{ id: '1',	name: 'James',		profilePic: 'test' },
			{ id: '2',	name: 'Alicia',		profilePic: 'test' },
			{ id: '3',	name: 'Marcus',		profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
			{ id: '4',	name: 'Napoleon',	profilePic: 'test' },
		],
		_messages: [
			{ id: '1',	senderId: '1',		time: new Date,		message: 'test' },
			{ id: '2',	senderId: '4',		time: new Date,		message: 'HelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorld' },
			{ id: '3',	senderId: '3',		time: new Date,		message: 'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World' },
			{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
			{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
			{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
			{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
			{ id: '2',	senderId: '4',		time: new Date,		message: 'HelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorld' },
		],
	}),
	getters: {
		channel:		(state) => computed((): IChannel		=> state._channel),
		members:		(state) => computed((): Array<IPlayer>	=> state._members),
		messages:		(state) => computed((): Array<IMessage>	=> state._messages),
	},
	actions: {
		changeChannelId(newChannel: IChannel){
			this._channel = newChannel;
			this._messages = [
				{ id: '1',	senderId: '1',		time: new Date,		message: 'test' },
				{ id: '2',	senderId: '4',		time: new Date,		message: 'HelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorld' },
				{ id: '3',	senderId: '3',		time: new Date,		message: 'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World' },
				{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
				{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
				{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
				{ id: '4',	senderId: '2',		time: new Date,		message: 'test' },
				{ id: '2',	senderId: '4',		time: new Date,		message: 'HelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorld' },
			]
		},
		getMessagePlayer(playedId: string): IPlayer | undefined {
			return this._members.find((el) => el.id === playedId)
		}
	}
})
