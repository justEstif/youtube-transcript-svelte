import { fail } from '@sveltejs/kit';
// import { fetchTranscript, retrieveVideoId } from '$lib/youtube-transcript.js';
import { fetchTranscript, fetchYouTubeMetadata, getVideoIdFromUrlOrId } from '$lib/youtube';

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const url = String(formData.get('url'));
			const id = getVideoIdFromUrlOrId(url);

			if (id) {
				const metadata = await fetchYouTubeMetadata(`https://www.youtube.com/watch?v=${id}`);
				try {
					const transcript = await fetchTranscript(id);
					return {
						metadata,
						transcript,
						embedUrl: `https://www.youtube.com/embed/${id}`
					};
				} catch (error) {
					return fail(400, {
						metadata,
						message: 'Error getting transcript',
						embedUrl: `https://www.youtube.com/embed/${id}`
					});
				}
			} else {
				return fail(400, { message: 'Invalid URL' });
			}
		} catch (error) {
			console.error('An error occurred:', error);
			return fail(500, { message: 'Internal server error' });
		}
	}
};
