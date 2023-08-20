import { fail } from '@sveltejs/kit';
import { fetchTranscript, retrieveVideoId } from '$lib/youtube-transcript.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const url = String(formData.get('url'));
		const id = retrieveVideoId(url);

		if (id) {
			try {
				const transcript = await fetchTranscript(id);
				const combinedTranscript = transcript.map((item) => item.text).join(' ');
				return {
					success: true,
					transcript: combinedTranscript,
					embedUrl: `https://www.youtube.com/embed/${id}`
				};
			} catch (error) {
				return fail(400, { url, message: 'error getting transcript' });
			}
		} else {
			return fail(400, { url, message: 'invalid url' });
		}
	}
};
