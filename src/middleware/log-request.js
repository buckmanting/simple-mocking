const logRequest = (options) => {
	return (request, response, next) => {
		if (options.logLevel !== 'info' ||
			options.logLevel !== 'warn' ||
			options.logLevel !== 'error' ||
			options.logLevel !== 'off') {
			console.log('📨', request.originalUrl, request.method, request.body);
		}
		next();
	};
};

module.exports = {logRequest};
