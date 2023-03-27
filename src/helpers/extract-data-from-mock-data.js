export function extractDataFromMockData(mockData, originalUrl, requestedError) {
	const splitUrl = originalUrl.split('/');
	// extract property from mockData by splitUrl
	let data = mockData;
	for (let i = 0; i < splitUrl.length; i++) {
		if (splitUrl[i]) {
			data = data[splitUrl[i]];
		}
	}

    // if requestedError is not null, then extract error data from mockData
    if (requestedError) {
        data = data[requestedError];
    }

	return data;
}
