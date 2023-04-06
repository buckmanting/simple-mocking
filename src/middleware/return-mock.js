const {extractDataFromMockData} = require('../helpers/extract-data-from-mock-data');
const {extractErrorRequest} = require('../helpers/extract-error');
const {buildMockPath} = require('../helpers/build-mock-path');

function extractDataFromPath(requestedError, mockPath, request, options, mockData) {
	if (requestedError) {
		mockPath = `${buildMockPath(request, options.mocksPath)}-${requestedError}.json`;
	} else {
		mockPath = `${buildMockPath(request, options.mocksPath)}.json`;
	}

	try {
		mockData = require(mockPath);
		console.log('📬', mockPath, mockData);
	} catch (exception) {
		console.error(exception);
	}
	return mockData;
}

const returnMock = (options) => {
	return (request, response) => {

		let mockData;
		const requestedError = extractErrorRequest(request, options);

		// if we have a mockData object, we need to extract the data from it
		// otherwise we can just require the mock file
		if (options.mockData) {
			mockData = extractDataFromMockData(options.mockData, request, requestedError);
		} else if (options.mocksPath) {
			let mockPath;
			mockData = extractDataFromPath(requestedError, mockPath, request, options, mockData);
		} else {
			console.error('You must supply a mocksPath or mockData in the options object');
		}

		// add the response overrides from the metadata
		if (mockData && mockData.__metadata && mockData.__metadata.response) {
			if (options.logLevel !== 'warn' ||
				options.logLevel !== 'error' ||
				options.logLevel !== 'off') {
				console.info('📄 contains meta data');
			}
			const responseOverrides = mockData.__metadata.response;

			if (responseOverrides.statusCode) {
				if (options.logLevel !== 'warn' ||
					options.logLevel !== 'error' ||
					options.logLevel !== 'off') {
					console.info(`👌 overriding the status code with "${responseOverrides.statusCode}"`);
				}
				response.statusCode = responseOverrides.statusCode ?? 200;
				response.headers = {
					...response.headers,
					...responseOverrides.headers
				};
			}
		}

		return response.json(mockData);
	};
};

module.exports = {returnMock};
