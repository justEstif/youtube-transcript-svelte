export const generateRequest = (page: string) => {
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
