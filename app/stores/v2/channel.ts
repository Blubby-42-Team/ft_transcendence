import { EChatType, IShortChannel, BackChannelType, IChannel, IChannelTypeSettings } from "#imports";

type test = {
	friends: IChannelTypeSettings,
	groups:  IChannelTypeSettings,
	chats:   IChannelTypeSettings,
}

export const useChannelStore = defineStore('channel', {
	state: () => ({
		_selectedChannel: 0,
		_types:         {
			friends: { type: [EChatType.friends],                     name: 'Friends', open: true, hasSideMenu: false, icon: 'material-symbols:person' },
			groups:  { type: [EChatType.group],                       name: 'Groups',  open: true, hasSideMenu: true,  icon: 'material-symbols:diversity-4' },
			chats:   { type: [EChatType.public, EChatType.protected], name: 'Chats',   open: true, hasSideMenu: true,  icon: 'material-symbols:groups' },
		} as test,
		_channelList:   [] as Array<number>,
		_channels:      {} as { [key: number]: IChannel | undefined },
		_shortChannels: {} as { [key: number]: IShortChannel | undefined },


		// Getters
		_selectedChannelGet: null as IChannel | null,
		_activeType:    {
			type: [EChatType.friends],
			name: 'Friends',
			open: true,
			hasSideMenu: false,
			icon: 'material-symbols:person',
		} as IChannelTypeSettings,
	}),
	getters: {
		selectedChannel: (state) => state._selectedChannelGet,
		channels:        (state): test => state._types,
		activeType:      (state): IChannelTypeSettings => state._activeType,
	},
	actions: {
		refresh(){
			this._selectedChannelGet = this._channels?.[this._selectedChannel] ?? null;
			this._activeType = (() => {
				switch (this._selectedChannelGet?.type){
					case EChatType.friends:   return this._types.friends;
					case EChatType.group:     return this._types.groups;
					case EChatType.public:    return this._types.chats;
					case EChatType.protected: return this._types.chats;
					default: return this._types.friends;
				};
			})() as IChannelTypeSettings;
			const channels = this._channelList.map((id) => this._shortChannels[id]);
			this._types.friends.channels = channels.filter((channel) => this._types.friends.type.includes(channel?.type as EChatType)) as IShortChannel[];
			this._types.groups.channels  = channels.filter((channel) => this._types.groups .type.includes(channel?.type as EChatType)) as IShortChannel[];
			this._types.chats.channels   = channels.filter((channel) => this._types.chats  .type.includes(channel?.type as EChatType)) as IShortChannel[];
		},
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
				this.refresh();
			});
		},
		selectChannel(userId: number, channelId: number){
			this._selectedChannel = channelId;
			return this.refreshChannel(userId, channelId);
		},
		postMessage(userId: number, message: string){
			return fetchPostMessage(userId, this._selectedChannel, message, () => {
				this.refreshChannel(userId, this._selectedChannel);
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
							type: message.type,
						})).reverse(),
						members: response.users.map((user) => user.userId),
						admin: response.admins,
					};

					this.refresh();
				}
			);
		},

		async addNewChannel(name: string, type: EChatType){
			const userStore = useUserStore();
			const { primaryUser } = storeToRefs(userStore);

			const { data } = await fetchCreateChat(primaryUser.value.id, type, name);
			return data.value ?? 0;
		},

		async addNewProtectedChannel(name: string, password: string, type: EChatType){
			const userStore = useUserStore();
			const { primaryUser } = storeToRefs(userStore);

			const { data } = await fetchCreateChatProtected(primaryUser.value.id, type, name, password);
			return data.value ?? 0;
		},

		async leaveChannel(channelId: number){
			const userStore = useUserStore();
			const { primaryUser } = storeToRefs(userStore);
			
			const { data } = await fetchLeaveChat(primaryUser.value.id, channelId);
			this.fetchChannelList(primaryUser.value.id);
			return data.value ?? ':(';
		},
	}
})
