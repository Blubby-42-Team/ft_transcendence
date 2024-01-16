
<script lang="ts" setup>

import { format } from 'date-fns'

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
	match: {
		type: Object as PropType<IHistory>,
		required: true,
	},
})

const { getUser, fetchUser } = useUserStore();
const user = getUser(computed(() => props.match.adversary));
await fetchUser(props.match.adversary);

const openMatchHistoryPreview = ref();

</script>

<template>
	<button class="contents group"
		@click.stop="openMatchHistoryPreview.open"
	>
		<div class="flex items-center justify-center h-12 overflow-hidden border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">
			<Icon name="material-symbols:shuffle" class="w-full h-full text-text-custom"/>
		</div>
		<div class="flex items-center justify-center h-12 px-5 overflow-hidden border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">
			<ClientOnly>
				{{ format(match.date, "dd MMM HH:mm") }}
			</ClientOnly>
		</div>
		<div class="flex items-center justify-center h-12 px-5 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">
			{{ user.name }}
		</div>
		<div class="flex items-center justify-center h-12 px-5 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">
			{{ match.score }}-{{ match.scoreAdv }}
		</div>
		<div class="flex items-center h-12 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">
			<template v-if="match.score > match.scoreAdv">
				<Icon name="material-symbols:trophy" class="w-10 h-10 text-text-custom"/>
			</template>
		</div>

		<GenericModal ref="openMatchHistoryPreview">
			<HistoryMatch :match="match" :userId="props.userId"/>
		</GenericModal>
	</button>
</template>