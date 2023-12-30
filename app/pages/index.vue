<script setup lang="ts">

definePageMeta({name: 'Home'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const notif = useState<Array<{ id: number, message: string }>>('notif', () => [])

let lastId = 0;

function addNotif(message: string) {
	if (notif.value.length >= 3){
		notif.value.shift();
	}
	notif.value.push({
		id: lastId++,
		message: `${message}-${lastId}`,
	});
	console.log(notif.value);
}

</script>

<template>
	<div class="flex items-center justify-center h-full p-5 text-9xl">
		<div>Welcome</div>
		<GenericButton :buttonStyle="2" @click="addNotif('test')">xd</GenericButton>
	</div>
</template>