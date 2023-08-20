import p from 'phin';
import { generateRequest } from './utils';

export const getVideoIdFromUrlOrId = (urlOrId: string): string => {
	const YOUTUBE_ID_LENGTH = 11;
	const YOUTUBE_URL_REGEX = new RegExp(
		`(?:youtube\\.com\\/(?:[^/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?/\\s]{${YOUTUBE_ID_LENGTH}})`,
		'i'
	);

	if (urlOrId.length === YOUTUBE_ID_LENGTH) {
		// If provided id
		return urlOrId;
	}

	const matchId = urlOrId.match(YOUTUBE_URL_REGEX);

	if (matchId && matchId[1]) {
		return matchId[1]; // Get id from link
	}

	throw new Error('Invalid user input: Please provide a valid YouTube Video URL or ID');
};

export const fetchYouTubeMetadata = async (url: string) => {
	const urlMetadata = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

	try {
		const { body }: { body: { title: string; author_name: string } } = await p({
			url: urlMetadata,
			parse: 'json'
		});
		console.log(body);
		return body;
	} catch (error) {
		console.error('Error fetching YouTube metadata:', error.message);
		return null; // Return null or a specific value to indicate failure
	}
};

export const fetchTranscript = async (id: string) => {
	try {
		const { body: videoPageBody } = await p(`https://www.youtube.com/watch?v=${id}`);
		const innerTubeApiKey = videoPageBody
			.toString()
			.split('"INNERTUBE_API_KEY":"')[1]
			.split('"')[0];

		if (innerTubeApiKey && innerTubeApiKey.length > 0) {
			const requestPayload = generateRequest(videoPageBody.toString());
			const { body }: { body: Record<string, any> } = await p({
				url: `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`,
				method: 'POST',
				data: requestPayload,
				parse: 'json'
			});

			if (body.responseContext) {
				const actions = body.actions;
				if (!actions) {
					throw new Error('Transcript is disabled on this video');
				}

				const transcripts =
					actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.map(
						(cue) => ({
							text: cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.cue.simpleText,
							duration: parseInt(
								cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.durationMs
							),
							offset: parseInt(
								cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.startOffsetMs
							)
						})
					);

				return transcripts.map((item) => item.text).join(' ');
			} else {
				throw new Error('Error fetching transcripts');
			}
		}
	} catch (error) {
		console.error('An error occurred while fetching the transcript:', error.message);
		throw error;
	}
};
