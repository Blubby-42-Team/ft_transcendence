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
	avatar: string,
	members: Array<number>,
	messages: Array<IMessage>,
}

export interface IShortChannel {
	id:		number,
	type:	ChannelType
	name:	string,
	avatar: string,
}

export type channelTypeSettings = {
    type: ChannelType;
    name: string;
    icon: string;
    open: boolean;
    hasBottom: boolean;
    hasSideMenu: boolean;
}