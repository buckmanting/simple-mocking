const {returnMock} = require('./middleware/return-mock');
const {logRequest} = require('./middleware/log-request');
const express = require('express');
const bodyParser = require('body-parser');

const startMockingServer = (options) => {
	return new Promise((resolve, reject) => {
		if (!options) {
			throw new Error('You must supply options for the configuration');
		}
		if (!options.mocksPath && !options.mockData) {
			throw new Error('You must supply a mocksPath or mockData');
		}
		const app = express();

		app.use(bodyParser.urlencoded({extended: false}));
		app.use(bodyParser.json());

		app.use(logRequest());

		app.use(returnMock(options));

		const port = options.port ?? 5010;
		const instance = app.listen(port, error => {
			if (error) {
				return reject(error);
			}
			console.info(`🎬 server started on http://localhost:${port}`);

			resolve(instance);
		});
	});
};

function closeMockingServer(server) {
	return new Promise((resolve, reject) => {
		server.close(error => {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	});
}

module.exports = {startMockingServer, closeMockingServer};
