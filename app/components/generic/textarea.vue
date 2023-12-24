<script setup lang="ts">

const textarea =  ref<HTMLInputElement>();

const rowsHeightStart = ref(1)
const rowsHeight = ref(rowsHeightStart.value)

function changeRows(event: any) {
	const textarea = event.target;
	
	rowsHeight.value = event.target.value.split("\n").length > rowsHeightStart.value ? event.target.value.split("\n").length : rowsHeightStart.value

  // Calculate the number of rows based on content height
	const contentHeight = textarea.scrollHeight - parseFloat(getComputedStyle(textarea.value).paddingTop) - parseFloat(getComputedStyle(textarea.value).paddingBottom);
	const calculatedRows = Math.max(rowsHeightStart.value, Math.ceil(contentHeight / parseFloat(getComputedStyle(textarea.value).lineHeight)));

	console.log(calculatedRows, contentHeight)
}

</script>

<template>
	<div class="p-5">
		<textarea name="text" placeholder="test"
			@input="changeRows"
			ref="textarea"
			:rows="rowsHeight"
			class="w-full h-auto overflow-y-scroll bg-pink-500 resize-none scrollbar-none rounded-xl"
		></textarea>
	</div>
</template>
