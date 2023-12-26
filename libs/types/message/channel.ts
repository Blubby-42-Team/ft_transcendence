export interface IPlayer {
	id			: string,
	name		: string,
	profilePic	: string,
}

export interface IMessage {
	id			: number,
	senderId	: number,
	message		: string,
	time		: Date,
}

export enum ChannelType {
	Group	= 1,
	Chat	= 2,
	Friend	= 3,
}

export interface IChannel {
	id:		number,
	type:	ChannelType
	name:	string,
	members: Array<number>,
	messages: Array<IMessage>,
}
