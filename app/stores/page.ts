export enum EPageCategories {
	NONE		= 0,
	GAME		= 1,
	TOURNAMENT	= 2,
	WATCH		= 3,
	FRIENDS		= 4,
	MESSAGES	= 5,
	SETTINGS	= 6,
};

export enum ESelectedLobby {
	Local,
	Classic,
	Random,
	Custom,
};

export const usePageStore = defineStore('page', {
	state: () => ({
		_selectedCategory: EPageCategories.NONE,
		_selectedLobby: ESelectedLobby.Local,
		_lobby: [
			{ id: ESelectedLobby.Classic,	name: 'Classic',	path: '/lobby/classic'},
			{ id: ESelectedLobby.Random,	name: 'Random',		path: '/lobby/random'},
			{ id: ESelectedLobby.Custom,	name: 'Custom',		path: '/lobby/custom'},
			{ id: ESelectedLobby.Local,		name: 'Local',		path: '/lobby/local'},
		]
	}),
	getters: {
		selectedCategory:	(state) => computed(() => state._selectedCategory),
		selectedLobby:		(state) => computed(() => state._selectedLobby),
		lobby:				(state) => state._lobby,
	},
	actions: {
		setPageDataLobby(newCategory: EPageCategories, newLobby: ESelectedLobby){
			this._selectedCategory = newCategory;
			this._selectedLobby = newLobby;
		},
		setSelectedCategory(newCategory: EPageCategories){
			this._selectedCategory = newCategory;
		},
	}
})
