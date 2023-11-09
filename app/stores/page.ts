export enum EPageCategories {
	NONE		= 0,
	GAME		= 1,
	TOURNAMENT	= 2,
	WATCH		= 3,
	FRIENDS		= 4,
	MESSAGES	= 5,
	SETTINGS	= 6,
};



const themesList = {
	default: {
		background:	{ type: 'color', color: 'black' },
		player1:	{ type: 'color', color: 'white' },
		player2:	{ type: 'color', color: 'white' },
		player3:	{ type: 'color', color: 'white' },
		player4:	{ type: 'color', color: 'white' },
		ball:		{ type: 'color', color: 'white' },
	},
	sunset: {
		background:	{ type: 'image', image: 'theme/sunset/background.png' },
		player1:	{ type: 'color', color: 'white' },
		player2:	{ type: 'color', color: 'white' },
		player3:	{ type: 'color', color: 'white' },
		player4:	{ type: 'color', color: 'white' },
		ball:		{ type: 'color', color: 'white' },
	}
}

export const usePageStore = defineStore('page', {
	state: () => ({
		_selectedCategory: EPageCategories.NONE,
		_title: "",
	}),
	getters: {
		selectedCategory: (state) => computed(() => state._selectedCategory),
		title: (state) => computed(() => state._title),
	},
	actions: {
		setPageData(newCategory: EPageCategories, newTitle: string){
			this._selectedCategory = newCategory;
			this._title = newTitle;
		},
		setSelectedCategory(newCategory: EPageCategories){
			this._selectedCategory = newCategory;
		},
		setTitle(newTitle: string){
			this._title = newTitle;
		},
	}
})
