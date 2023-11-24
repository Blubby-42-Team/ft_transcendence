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
		_title: "",
		_selectedLobby: ESelectedLobby.Local,
		_lobby: [
			{ id: ESelectedLobby.Local,		name: 'Local',		path: '/lobby/local'},
			{ id: ESelectedLobby.Classic,	name: 'Classic',	path: '/lobby/classic'},
			{ id: ESelectedLobby.Random,	name: 'Random',		path: '/lobby/random'},
			{ id: ESelectedLobby.Custom,	name: 'Custom',		path: '/lobby/Custom'},
		]
	}),
	getters: {
		selectedCategory:	(state) => computed(() => state._selectedCategory),
		title:				(state) => computed(() => state._title),
		selectedLobby:		(state) => computed(() => state._selectedLobby),
		lobby:				(state) => computed(() => state._lobby),
	},
	actions: {
		setPageData(newCategory: EPageCategories, newTitle: string){
			console.log('setPageData')
			this._selectedCategory = newCategory;
			this._title = newTitle;
		},
		setPageDataLobby(newCategory: EPageCategories, newTitle: string, newLobby: ESelectedLobby){
			console.log('setPageData')
			this._selectedCategory = newCategory;
			this._title = newTitle;
			this._selectedLobby = newLobby;
		},
		setSelectedCategory(newCategory: EPageCategories){
			console.log('setSelectedCategory')
			this._selectedCategory = newCategory;
		},
		setTitle(newTitle: string){
			console.log('setTitle')
			this._title = newTitle;
		},
		setSelectedLobby(newLobby: ESelectedLobby){
			console.log('setSelectedLobby')
			this._selectedLobby = newLobby;
		},
	}
})
