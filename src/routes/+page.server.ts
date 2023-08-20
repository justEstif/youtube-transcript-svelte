import { fail } from '@sveltejs/kit';
import { fetchTranscript, retrieveVideoId } from '$lib/youtube-transcript.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const url = String(formData.get('url'));
		try {
			// check if valid link
			// get youtube id
			// get youtube video title
			// get youtube source
			// get transcript
			// get youtube link
			const id = retrieveVideoId(url);
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
	}
};
