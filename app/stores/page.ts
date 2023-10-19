export enum EPageCategories {
	NONE		= 0,
	GAME		= 1,
	TOURNAMENT	= 2,
	WATCH		= 3,
	FRIENDS		= 4,
	MESSAGES	= 5,
	SETTINGS	= 6,
};

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
