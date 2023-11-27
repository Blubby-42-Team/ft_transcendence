export enum ChannelType {
	Group	= 1,
	Chat	= 2,
	Friend	= 3,
}

export interface IChannel {
	id:		number,
	type:	ChannelType
	name:	string,
}

export interface IChannelType {
	type:			ChannelType,
	name:			string,
	icon:			string,
	open:			boolean,
	hasBottom:		boolean,
	hasSideMenu:	boolean,
}

export const useChannelListStore = defineStore('channelList', {
	state: (): {
		_selectedChannel:		number,
		_isSideMenuOpen:		boolean,
		_selectedChannelMenu:	ChannelType,
		_channels:				Array<IChannel>;
		_channelType:			Array<IChannelType>
	} => ({
		_selectedChannel: 1,
		_selectedChannelMenu: ChannelType.Friend,
		_isSideMenuOpen: true,
		_channels: [
			{	id: 1,		type: ChannelType.Chat,		name: 'Chats 1'		},
			{	id: 2,		type: ChannelType.Chat,		name: 'Chats 2'		},
			{	id: 3,		type: ChannelType.Chat,		name: 'Chats 3'		},
			{	id: 4,		type: ChannelType.Chat,		name: 'Chats 4'		},
			{	id: 5,		type: ChannelType.Chat,		name: 'Chats 5'		},
			{	id: 6,		type: ChannelType.Chat,		name: 'Chats 6'		},
			{	id: 7,		type: ChannelType.Chat,		name: 'Chats 7'		},
			{	id: 8,		type: ChannelType.Chat,		name: 'Chats 8'		},
			{	id: 9,		type: ChannelType.Chat,		name: 'Chats 9'		},
			{	id: 10,		type: ChannelType.Chat,		name: 'Chats 10'	},
			{	id: 11,		type: ChannelType.Friend,	name: 'Friend 1'	},
			{	id: 12,		type: ChannelType.Friend,	name: 'Friend 2'	},
			{	id: 13,		type: ChannelType.Friend,	name: 'Friend 3'	},
			{	id: 14,		type: ChannelType.Friend,	name: 'Friend 4'	},
			{	id: 15,		type: ChannelType.Friend,	name: 'Friend 5'	},
			{	id: 16,		type: ChannelType.Friend,	name: 'Friend 6'	},
			{	id: 17,		type: ChannelType.Friend,	name: 'Friend 7'	},
			{	id: 18,		type: ChannelType.Friend,	name: 'Friend 8'	},
			{	id: 19,		type: ChannelType.Friend,	name: 'Friend 9'	},
			{	id: 20,		type: ChannelType.Friend,	name: 'Friend 10'	},
			{	id: 21,		type: ChannelType.Group,	name: 'Group 1'		},
			{	id: 22,		type: ChannelType.Group,	name: 'Group 2'		},
			{	id: 23,		type: ChannelType.Group,	name: 'Group 3'		},
			{	id: 24,		type: ChannelType.Group,	name: 'Group 4'		},
			{	id: 25,		type: ChannelType.Group,	name: 'Group 5'		},
			{	id: 26,		type: ChannelType.Group,	name: 'Group 6'		},
			{	id: 27,		type: ChannelType.Group,	name: 'Group 7'		},
			{	id: 28,		type: ChannelType.Group,	name: 'Group 8'		},
			{	id: 29,		type: ChannelType.Group,	name: 'Group 9'		},
			{	id: 30,		type: ChannelType.Group,	name: 'Group 10'	},
		],
		_channelType: [
			{
				type: ChannelType.Friend,
				name: 'Friends',
				icon: 'material-symbols:person',
				open: true,
				hasBottom: true,
				hasSideMenu: false,
			},
			{
				type: ChannelType.Group,
				name: 'Groups',
				icon: 'material-symbols:diversity-4',
				open: false,
				hasBottom: true,
				hasSideMenu: true,
			},
			{
				type: ChannelType.Chat,
				name: 'Chats',
				icon: 'material-symbols:groups',
				open: false,
				hasBottom: false,
				hasSideMenu: true,
			}
		],
	}),
	getters: {
		channels:				(state) => computed((): Array<IChannel> => state._channels),
		channelType:			(state) => computed((): Array<IChannelType> => state._channelType),
		isSideMenuOpen:			(state) => computed(() => state._isSideMenuOpen),
		selectedChannel:		(state) => computed(() => state._channels.find((channel) => channel.id === state._selectedChannel)),
		selectedChannelType:	(state) => computed(() => state._channelType.find((type) => type.type === (state._channels.find((channel) => channel.id === state._selectedChannel)?.type))),
	},
	actions: {
		updateSelectedChannel(id: number) {
			this._selectedChannel = id;
		},
		toggleSideMenu() {
			this._isSideMenuOpen = !this._isSideMenuOpen;
		},
		selectChannelMenu(newMenu: ChannelType) {
			this._selectedChannelMenu = newMenu;
		},
	},
})
