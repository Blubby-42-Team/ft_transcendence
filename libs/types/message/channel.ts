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
	time		: Date,
}

export interface IChannel {
	id:		number,
	type:	EChatType
	name:	string,
	avatar: string,
	members: Array<number>,
	messages: Array<IMessage>,
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
	type: 'group' | 'friend' | 'public' | 'protected',
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