<script lang="ts">
	export let form;
</script>

<div class="py-10 join">
	<form method="POST" class="flex">
		<input
			class="input input-bordered w-full max-w-lg join-item"
			placeholder="Youtube URL"
			type="text"
			name="url"
			required
		/>
		<button type="submit" class="btn join-item">Search</button>
	</form>
</div>

{#if form?.message}
	<p>{form?.message}</p>
{:else if form?.transcript}
	<iframe
		class="pb-10 w-full aspect-video"
		src={form?.embedUrl}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		allowfullscreen
	/>
	<p>{form?.transcript}</p>
{/if}
