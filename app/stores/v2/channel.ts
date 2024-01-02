import { EChatType, IShortChannel, BackChannelType, IChannel, IChannelTypeSettings } from "#imports";

export const useChannelStore = defineStore('channel', {
	state: () => ({
		_selectedChannel: 0,
		_types:         {
			friends: { type: [EChatType.friends],                     name: 'Friends', open: true, hasSideMenu: false, icon: 'material-symbols:person' } as IChannelTypeSettings,
			groups:  { type: [EChatType.group],                       name: 'Groups',  open: true, hasSideMenu: true,  icon: 'material-symbols:diversity-4' } as IChannelTypeSettings,
			chats:   { type: [EChatType.public, EChatType.protected], name: 'Chats',   open: true, hasSideMenu: true,  icon: 'material-symbols:groups' } as IChannelTypeSettings,
		},
		_channelList:   [] as Array<number>,
		_channels:      {} as { [key: number]: IChannel | undefined },
		_shortChannels: {} as { [key: number]: IShortChannel | undefined },
	}),
	getters: {
		selectedChannel: (state) => computed(() => state._channels?.[state._selectedChannel] ?? null),
		channels:        (state) => computed((): {
			friends: IChannelTypeSettings,
			groups:  IChannelTypeSettings,
			chats:   IChannelTypeSettings,
		} => {
			const channels = state._channelList.map((id) => state._shortChannels[id]);
			state._types.friends.channels = channels.filter((channel) => state._types.friends.type.includes(channel?.type as EChatType)) as IShortChannel[];
			state._types.groups.channels  = channels.filter((channel) => state._types.groups .type.includes(channel?.type as EChatType)) as IShortChannel[];
			state._types.chats.channels   = channels.filter((channel) => state._types.chats  .type.includes(channel?.type as EChatType)) as IShortChannel[];
			return state._types;
		}),
		activeType:      (state) => computed((): IChannelTypeSettings => {
			const selectChannel = state._channels?.[state._selectedChannel] ?? null;
			if (state._types.friends.type.includes(selectChannel?.type as EChatType)){
				return state._types.friends;
			}
			if (state._types.groups.type.includes(selectChannel?.type as EChatType)){
				return state._types.groups;
			}
			if (state._types.chats.type.includes(selectChannel?.type as EChatType)){
				return state._types.chats;
			}
			return state._types.friends;
		}),
	},
	actions: {
		fetchChannelList(userId: number){
			return fetchAllChats(userId, (response) => {
				
				for (const chat of response){
					this._shortChannels[chat.id] = {
						id: chat.id,
						type: chat.type,
						name: chat.name,
						avatar: chat.chat_picture,
					};
				};
				this._channelList = response.map((chat) => chat.id);
			});
		},
		selectChannel(userId: number, channelId: number){
			this._selectedChannel = channelId;
			return this.refreshChannel(userId, channelId);
		},
		postMessage(userId: number, message: string){
			return fetchPostMessage(userId, this._selectedChannel, message, (response) => {
				this._channels[this._selectedChannel]!.messages.push({
					id: response.messageId,
					senderId: response.userId,
					message: response.content,
					time: new Date(response.date),
				});
			});
		},
		refreshChannel(userId: number, channelId: number){
			if (channelId === 0 || userId === 0){
				return;
			}
			const { updateShortUser } = useUserStore();
			return fetchChatsById(userId, channelId,
				(response) => {
					updateShortUser(response.users.map((user) => ({
						id: user.userId,
						name: user.userName,
						avatar: user.profile_picture,
					})))

					this._channels[channelId] = {
						id: response.id,
						name: response.name,
						type: response.type,
						avatar: response.chat_picture,
						messages: response.messages.map((message) => ({
							id: message.messageId,
							senderId: message.userId,
							message: message.content,
							time: new Date(message.date),
						})).reverse(),
						members: response.users.map((user) => user.userId),
					};
				}
			);
		}
	}
})
