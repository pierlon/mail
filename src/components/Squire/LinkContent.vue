<template>
	<div>
		<div class="row">
			<label for="url">URL link</label>
			<input id="url" :value="url" type="text" @input="onUrlInput" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'LinkContent',
	props: {
		url: {
			type: String,
			required: true,
		},
	},
	methods: {
		onUrlInput(e) {
			this.$emit('update:url', e.target.value)
		},
	},
}
</script>

<style scoped></style>
