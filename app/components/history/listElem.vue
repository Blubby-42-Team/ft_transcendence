
<script lang="ts" setup>

import { format } from 'date-fns'

</script>

<template>
	<div :to="`/watch/game/id/1`" class="contents group">
		<div class="flex items-center justify-center h-12 overflow-hidden border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30"><Icon name="material-symbols:shuffle" class="w-full h-full text-text-custom"/></div>
		<div class="flex items-center justify-center h-12 px-5 overflow-hidden border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30"><ClientOnly>{{ format(new Date(), "dd MMM HH:MM") }}</ClientOnly></div>
		<div class="flex items-center h-12 px-5 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">Karen69420</div>
		<div class="flex items-center justify-end h-12 px-5 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30">3-10</div>
		<div class="flex items-center h-12 overflow-hidden truncate border-t group-hover:bg-color1 group-hover:bg-opacity-30 whitespace-nowrap border-text border-opacity-30"><Icon name="material-symbols:trophy" class="w-10 h-10 text-text-custom"/></div>
	</div>
</template>