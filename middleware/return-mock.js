const {extractErrorRequest} = require('../helpers/extract-error');
const {buildMockPath} = require('../helpers/build-mock-path');

const returnMock = () => {
    return (request, response) => {
        let mockPath;

        const requestedError = extractErrorRequest(request.body);
        if (requestedError) {
            mockPath = `${buildMockPath(request)}-${requestedError}.json`;
        } else {
            mockPath = `${buildMockPath(request)}.json`;
        }

        let mockData;
        try {
            mockData = require(mockPath);
            console.log('📬', mockPath, mockData);
        } catch (exception) {
            console.error(exception);
        }
        // add the response overrides from the meta data
        if (mockData && mockData._meta && mockData._meta.response) {
            console.info('📄 contains meta data');
            const responseOverrides = mockData._meta.response;

            if (responseOverrides.statusCode) {
                console.info(`👌 overriding the status code with "${responseOverrides.statusCode}"`);
                response.statusCode = responseOverrides.statusCode ?? 200;
            }
        }

        return response.json(mockData);
    };
};

module.exports = {returnMock};