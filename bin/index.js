const {startMockingServer} = require ('../src/mocks-server');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{name: 'port', alias: 'p', type: Number},
	{name: 'path', type: String, defaultOption: true}
];
const options = commandLineArgs(optionDefinitions);

// todo add command-line-usage to show help
// https://github.com/75lb/command-line-usage

startMockingServer({
	mocksPath: options.path,
	port: options.port
});
