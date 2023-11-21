<script setup lang="ts">

let isFront = useState(() => [
	{ type: CardType.PLAYER },
	{ type: CardType.ADD },
	{ type: CardType.ADD },
	{ type: CardType.EMPTY },
]);

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_auto]">
		<PlaySettings/>
		<div class="grid h-full grid-cols-[repeat(4,1fr)] w-full">
			<template v-for="el of isFront">
				<div class="p-2">
					<PlayLobbyCard :type="el.type" @click="() => el.type = CardType.PLAYER"/>
				</div>
			</template>
		</div>
	</div>
</template>

<style>

.card {
	backface-visibility: hidden;
	transition: transform 1s;
}

.flip-enter-active {
	transform: rotateY(-180deg);
}

.flip-enter {
	transform: rotateY(-180deg);
}

.flip-leave-active {
	transform: rotateY(180deg);
}

.flip-leave{
	transform: rotateY(180deg);
}

</style>
