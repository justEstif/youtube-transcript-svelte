<script lang="ts">
	export let form;
</script>

<form method="POST">
	<label>
		Youtube URL
		<input type="text" name="url" required />
	</label>
</form>

{#if form?.message}
	<p>{form?.message}</p>
{:else if form?.transcript}
	<iframe
		class="w-full aspect-video"
		src={form?.embedUrl}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		allowfullscreen
	/>
	<p>{form?.transcript}</p>
{/if}
