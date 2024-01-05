import { EChatType } from "#imports"

export interface IPlayer {
	id			: string,
	name		: string,
	profilePic	: string,
}

export interface IMessage {
	id			: number,
	senderId	: number,
	message		: string,
	type        : "user" | "system",
	time		: Date,
}

export interface IChannel {
	id:			number,
	type:		EChatType
	name:		string,
	avatar: 	string,
	members: 	Array<number>,
	messages: 	Array<IMessage>,
	admin:  	Array<number>,
}

export interface IShortChannel {
	id:		number,
	type:	EChatType
	name:	string,
	avatar: string,
}

export type channelTypeSettings = {
    type: EChatType;
    name: string;
    icon: string;
    open: boolean;
    hasBottom: boolean;
    hasSideMenu: boolean;
}


export type BackChannelType = {
	id: number,
	type: Exclude<EChatType, "inactive">
	name: string,
	chat_picture: string,
	owner: number,
	messages: Array<{
		messageId: number,
		type: "user" | "system",
		userId: number,
		content: string,
		date: string,
	}>,
	users: Array<{
		userId: number,
		userName: string,
		profile_picture: string
	}>,
	admins: Array<number>,
	blacklist: Array<number>
}

export type IChannelTypeSettings = {
	type: Array<EChatType>,
	name: string,
	open: boolean,
	hasSideMenu: boolean,
	channels?: Array<IShortChannel>,
	icon: string,
}