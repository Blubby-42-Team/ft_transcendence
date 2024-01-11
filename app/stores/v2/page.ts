import { EGameMode } from '../../../libs/types/game/game'

export enum EPageCategories {
	NONE		= 0,
	GAME		= 1,
	TOURNAMENT	= 2,
	WATCH		= 3,
	FRIENDS		= 4,
	MESSAGES	= 5,
	SETTINGS	= 6,
	HISTORY		= 7,
};

export const usePageStore = defineStore('page', {
	state: () => ({
		_selectedCategory: EPageCategories.NONE,
		_selectedLobby: EGameMode.Local,
		_lobby: [
			{ id: EGameMode.Classic,	name: 'Ranked',	path: '/lobby/classic'},
			// { id: EGameMode.Random,		name: 'Random',		path: '/lobby/random'},
			{ id: EGameMode.Custom,		name: 'Custom',		path: '/lobby/custom'},
			{ id: EGameMode.Local,		name: 'Local',		path: '/lobby/local'},
		],
		_waiting: 1,
	}),
	getters: {
		selectedCategory:	(state) => computed(() => state._selectedCategory),
		selectedLobby:		(state) => computed(() => state._selectedLobby),
		lobby:				(state) => state._lobby,
		waitingString:		(state) => computed(() => '.'.repeat(state._waiting)),
	},
	actions: {
		startLoopWaiting(){
			setInterval(() => {
				this._waiting = (this._waiting < 3 ? this._waiting + 1 : 1);
			}, 500);
		},
		setPageDataLobby(newCategory: EPageCategories, newLobby: EGameMode){
			this._selectedCategory = newCategory;
			this._selectedLobby = newLobby;
		},
		setSelectedCategory(newCategory: EPageCategories){
			this._selectedCategory = newCategory;
		},
	}
})
