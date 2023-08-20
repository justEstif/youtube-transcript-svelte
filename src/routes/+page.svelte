<script lang="ts">
	export let form;
</script>

<svelte:head>
	<title>{form?.metadata?.title || 'YouTube Transcript'}</title>
	<meta name="author" content={form?.metadata?.author_name || ''} />
</svelte:head>

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

{#if form?.embedUrl}
	<div class="aspect-w-16 aspect-h-9">
		<iframe
			class="pb-10 w-full aspect-video"
			src={form?.embedUrl}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		/>
	</div>
{/if}

{#if form?.message}
	<p>{form?.message}</p>
{:else if form?.transcript}
	<p>{form?.transcript}</p>
{/if}
