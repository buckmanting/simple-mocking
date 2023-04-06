const errorRegex = /^error\.[a-z-]*$/;

const _extractErrorFromString = (property, logLevel) => {
	// see if the property contains an error in the correct format
	if (errorRegex.test(property)) {
		// extract the error
		let error = property.split('.')[1];
		if (logLevel !== 'info' ||
			logLevel !== 'warn' ||
			logLevel !== 'error' ||
			logLevel !== 'off') {
			console.info(`✅ found error ${error}`);
		}

		return error;
	} else {
		if (logLevel !== 'info' ||
			logLevel !== 'warn' ||
			logLevel !== 'error' ||
			logLevel !== 'off') {
			console.info('⛔️ does not contain error request.');
		}
	}
};

function _findError(body, logLevel) {
	if (!body) {
		return;
	}

	let error;

	const keys = Object.keys(body);
	for (let i = 0; i < keys.length; i++) {
		if (error) {
			break;
		}

		const key = keys[i];
		// get the property
		let property = body[key];

		// check if the property is an object
		if (typeof (property) === 'object') {
			// check if an array
			if (Array.isArray(property)) {
				// check and extract error from array
				const foundError = property.reduce((previous, current) => {
					return errorRegex.test(current);
				})[0];

				if (foundError) {
					if (logLevel !== 'info' ||
						logLevel !== 'warn' ||
						logLevel !== 'error' ||
						logLevel !== 'off') {
						console.info(`🔎 found property "${key}": "${property}" ["${foundError}"].`);
					}

					error = _extractErrorFromString(foundError, logLevel);
				}
			}
			if (logLevel !== 'info' ||
				logLevel !== 'warn' ||
				logLevel !== 'error' ||
				logLevel !== 'off') {
				console.info(`🥾 found object "${key}", stepping inside`);
			}

			// use recursion to walk to the child object
			error = _findError(property);
		} else if (typeof (property) === 'string') {
			if (logLevel !== 'info' ||
				logLevel !== 'warn' ||
				logLevel !== 'error' ||
				logLevel !== 'off') {
				console.info(`🔎️ found property "${key}": "${property}".`);
			}

			error = _extractErrorFromString(property);
		}
	}
	return error;
}

const extractErrorRequest = (request, options) => {
	let error = _findError(request.body, options.logLevel);

	if (error) {
		if (options.logLevel !== 'info' ||
			options.logLevel !== 'warn' ||
			options.logLevel !== 'error' ||
			options.logLevel !== 'off') {
			console.info(`🔎 found error: "${error}"`);
		}
	} else {
		if (options.logLevel !== 'info' ||
			options.logLevel !== 'warn' ||
			options.logLevel !== 'error' ||
			options.logLevel !== 'off') {
			console.info(`🤷‍♀️ could not find an error`);
		}
	}
	return error;
};

module.exports = {extractErrorRequest};
