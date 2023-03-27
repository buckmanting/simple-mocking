import {extractDataFromMockData} from '../helpers/extract-data-from-mock-data';

const {extractErrorRequest} = require('../helpers/extract-error');
const {buildMockPath} = require('../helpers/build-mock-path');

const returnMock = (options) => {
    return (request, response) => {
        let mockPath;

        const requestedError = extractErrorRequest(request.body);
        if (requestedError) {
            mockPath = `${buildMockPath(request, options.mocksPath)}-${requestedError}.json`;
        } else {
            mockPath = `${buildMockPath(request, options.mocksPath)}.json`;
        }

        let mockData;
        try {
            if(options.mockData){
                mockData = extractDataFromMockData(options.mockData, request.originalUrl, requestedError);
            } else if(options.mocksPath) {
                mockData = require(mockPath);
            }
            else{
                console.error('You must supply a mocksPath or mockData in the options object');
            }
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
