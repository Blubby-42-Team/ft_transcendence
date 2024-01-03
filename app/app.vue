<script setup lang="ts">

const { selectedCategory, selectedLobby, startLoopWaiting } = usePageStore();
const { setup } = useUserStore();
const { selectedChannel, channels, activeType } = useChannelStore();
const { notif } = useNotifStore();

const defaultSettings = {
	maxPoint:			2,
	numPlayer:			4,
	ballSize:			1,
	padSize:			5,
	mode:				BotDifficulty.NORMAL,
	randomizer:			false,
	initialBallSpeed:	0.5,
	speedAcceleration:	0.1,
};

const defaultTheme: gameTheme = {
	fontColor:			'white',
	background:			{	type: 'color',	color: 'black'	},
	ball:				{	type: 'color',	color: 'white'	},
	player_top:			{	type: 'color',	color: 'red'	},
	player_bottom:		{	type: 'color',	color: 'green'	},
	player_left:		{	type: 'color',	color: 'blue'	},
	player_right:		{	type: 'color',	color: 'yellow'	},
	player4BottomRight:	{	type: 'color',	color: 'white'	},
	player4TopRight:	{	type: 'color',	color: 'white'	},
	player4BottomLeft:	{	type: 'color',	color: 'white'	},
	player4TopLeft:		{	type: 'color',	color: 'white'	},
	player4BottomElim:	{	type: 'color',	color: 'white'	},
	player4TopElim:		{	type: 'color',	color: 'white'	},
	player4LeftElim:	{	type: 'color',	color: 'white'	},
	player4RightElim:	{	type: 'color',	color: 'white'	},
	player2Bottom:		{	type: 'color',	color: 'white'	},
	player2Top:			{	type: 'color',	color: 'white'	},
}

startLoopWaiting()

const theme			= useState('theme', () => 'theme-dark');
useState<gameSettingsType>('settings', () => defaultSettings);
useState<gameTheme>('gameTheme', () => defaultTheme);

if (process.client) {
	setup();
}

</script>

<template>
	<div class="w-screen h-screen" :class="theme ? theme : 'theme-light'">
		<NuxtLayout>
			<!-- :transition="{
				name: 'bounce',
				mode: 'out-in'
			}" -->
			<NuxtPage
			/>
		</NuxtLayout>
		<div id="modals"/>
	</div>
</template>

<!-- <style>
.bounce-enter-active,
.bounce-leave-active {
	transition: all 0.1s;
}
.bounce-enter-from,
.bounce-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style> -->