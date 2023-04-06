// todo AB (20/10): this is currently tested by proxy, it should probably be moved to helpers and explicitally tested
const lowerCaseFirstChar = str => {
	return str.charAt(0).toLowerCase() + str.slice(1);
};

// todo AB (20/10): this is currently tested by proxy, it should probably be moved to helpers and explicitally tested
const isObject = item => {
	return (item && typeof item === 'object' && !Array.isArray(item));
};

// todo AB (20/10): this is currently tested by proxy, it should probably be moved to helpers and explicitally tested
const mergeDeep = (target, source) => {
	// objects are a reference type, so we create a new object out of the target to build out
	const output = {...target};
	// check we're working with objects
	if (isObject(target) && isObject(source)) {
		// loop over the keys of our source object
		Object.keys(source).forEach(key => {
			// check to see if source.key is an object
			if (isObject(source[key])) {
				// if our current key of our source is in the target object
				// use ✨recursion✨ to walk through the next levels
				if (key in target) {
					output[key] = mergeDeep(target[key], source[key]);
				} else {
					// if it's not we can directly assign the object to the output
					Object.assign(output, {[key]: source[key]});
				}
			} else {
				// if it's not an object we can simply assign the value to output
				Object.assign(output, {[key]: source[key]});
			}
		});
	}
	return output;
};

const transformModelErrors = (request, response, next) => {
	if (!request.backendResponse || !request.backendResponse.modelErrors ||
		request.backendResponse.modelErrors.length === 0) {
		return next();
	}

	if (!request.backendResponse.data) {
		request.backendResponse.data = {};
	}

	let errors = {};
	for (let i = 0; i < request.backendResponse.modelErrors.length; i++) {
		const modelError = request.backendResponse.modelErrors[i];
		const keys = modelError.field.split('.');

		if (keys.includes('undefined') || keys.includes('null')) {
			throw new TypeError(`cannot extract errors from "${modelError.field}"`);
		}

		if (keys.length === 1) {
			const field = lowerCaseFirstChar(modelError.field);
			errors[field] = modelError.errors;
		} else {
			const unflattenedErrors = {};
			// this is where the unflattening work happens, reducing our array to an object
			keys.reduce((prev, curr, j) => {
				// if this is the last in the array of key it equals our errors array
				const objectValue = keys.length - 1 === j ? modelError.errors : {};
				// check the current field exists on the object from the previous iteration
				// and also when the next key isn't a number
				if (prev[curr] || isNaN(Number(keys[j + 1]))) {
					// js-ify the property name and set prev.currentKey to the objectValue (errors or and empty obj)
					prev[lowerCaseFirstChar(curr)] = objectValue;
					// return the objectValue and continue
					return objectValue;
				}
				// return an empty array so we can support unflattening arrays
				return [];
			}, unflattenedErrors);

			errors = mergeDeep(errors, unflattenedErrors);
		}
	}

	request.backendResponse.data.errors = errors;

	return next();
};


const extractDataFromMockData = (mockData, request, requestedError) => {
	const splitUrl = request.originalUrl.split('/');
	// extract property from mockData by splitUrl
	let data = mockData;
	for (let i = 0; i < splitUrl.length; i++) {
		// if it is the penultimate item in the splitUrl, then use the request method to get the data
		if (i === splitUrl.length -2) {
			data = data[request.method];
		}

		if (splitUrl[i]) {
			// if splitUrl[i] has __options, and it is a function, then call it and set data to the result
			if (data[splitUrl[i]].__options && typeof data[splitUrl[i]].__options === 'function') {
				if (options.logLevel !== 'info' ||
					options.logLevel !== 'warn' ||
					options.logLevel !== 'error' ||
					options.logLevel !== 'off') {
					console.log('⚙️', 'came across a function at', splitUrl.slice(0, i + 1).join('/'));
				}
				data = data[splitUrl[i]].__options();
			} else {
				data = data[splitUrl[i]];
			}
		}
	}

	// if requestedError is not null, then extract error data from mockData
	if (requestedError) {
		data = data[requestedError];
	}

	return data;
};

module.exports = {extractDataFromMockData};
