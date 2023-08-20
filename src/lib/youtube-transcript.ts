import p from 'phin';

const RE_YOUTUBE =
	/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

export const retrieveVideoId = (videoId: string) => {
	if (videoId.length === 11) {
		// if provided id
		return videoId;
	}
	const matchId = videoId.match(RE_YOUTUBE);
	if (matchId && matchId.length) {
		return matchId[1]; // get id from link
	}
	// throw error
	throw new Error("Error: couldn't retrieve Youtube video ID");
};

export const fetchMeta = async (id: string) => {
	const { body: videoPageBody } = await p(`https://www.youtube.com/watch?v=${id}`);
	const innerTubeApiKey = videoPageBody.toString().split('"INNERTUBE_API_KEY":"')[1].split('"')[0];

	const response = await fetch(
		'https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w',
		{
			method: 'POST',
			body: JSON.stringify({
				videoId: 'kt_ELiL-GIQ',
				context: {
					client: {
						clientName: 'ANDROID',
						clientVersion: '17.10.35',
						androidSdkVersion: 30
					}
				}
			})
		}
	);
	const data = await response.json();
	console.log(data);
	if (innerTubeApiKey && innerTubeApiKey.length > 0) {
		const { body }: { body: Record<string, any> } = await p({
			url: `https://www.youtube.com/youtubei/v1/player?key=${innerTubeApiKey}`,
			method: 'POST',
			data: generateRequest(videoPageBody.toString()),
			parse: 'json'
		});
		console.log(body);
	}
};

export const fetchTranscript = async (id: string) => {
	const { body: videoPageBody } = await p(`https://www.youtube.com/watch?v=${id}`);
	const innerTubeApiKey = videoPageBody.toString().split('"INNERTUBE_API_KEY":"')[1].split('"')[0];

	if (innerTubeApiKey && innerTubeApiKey.length > 0) {
		const { body }: { body: Record<string, any> } = await p({
			url: `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`,
			method: 'POST',
			data: generateRequest(videoPageBody.toString()),
			parse: 'json'
		});

		if (body.responseContext) {
			if (!body.actions) {
				throw new Error('Transcript is disabled on this video');
			}
			const transcripts =
				body.actions[0].updateEngagementPanelAction.content.transcriptRenderer.body
					.transcriptBodyRenderer.cueGroups;

			return transcripts.map((cue) => ({
				text: cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.cue.simpleText,
				duration: parseInt(cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.durationMs),
				offset: parseInt(cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.startOffsetMs)
			}));
		}
	}
};

const generateRequest = (page: string) => {
	const params = page.split('"serializedShareEntity":"')[1]?.split('"')[0];
	const visitorData = page.split('"VISITOR_DATA":"')[1]?.split('"')[0];
	const sessionId = page.split('"sessionId":"')[1]?.split('"')[0];
	const clickTrackingParams = page?.split('"clickTrackingParams":"')[1]?.split('"')[0];

	return {
		context: {
			client: {
				hl: 'en',
				gl: 'US',
				visitorData,
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)',
				clientName: 'WEB',
				clientVersion: '2.20200925.01.00',
				osName: 'Macintosh',
				osVersion: '10_15_4',
				browserName: 'Chrome',
				browserVersion: '85.0f.4183.83',
				screenWidthPoints: 1440,
				screenHeightPoints: 770,
				screenPixelDensity: 2,
				utcOffsetMinutes: 120,
				userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
				connectionType: 'CONN_CELLULAR_3G'
			},
			request: {
				sessionId,
				internalExperimentFlags: [],
				consistencyTokenJars: []
			},
			user: {},
			clientScreenNonce: crypto.randomUUID(),
			clickTracking: {
				clickTrackingParams
			}
		},
		params
	};
};
