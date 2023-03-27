const errorRegex = /^error\.[a-z-]*$/;

const _extractErrorFromString = property => {
    // see if the property contains an error in the correct format
    if (errorRegex.test(property)) {
        // extract the error
        let error = property.split('.')[1];
        console.info(`✅ found error ${error}`);

        return error;
    } else {
        console.info('⛔️ does not contain error request.');
    }
};

function _findError(body) {
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
                    console.info(`🔎 found property "${key}": "${property}" ["${foundError}"].`);

                    error = _extractErrorFromString(foundError);
                }
            }
            console.info(`🥾 found object "${key}", stepping inside`);

            // use recursion to walk to the child object
            error = _findError(property);
        } else if (typeof (property) === 'string') {
            console.info(`🔎️ found property "${key}": "${property}".`);

            error = _extractErrorFromString(property);
        }
    }
    return error;
}

const extractErrorRequest = request => {
    let error = _findError(request.body);

    if (error) {
        console.info(`🔎 found error: "${error}"`);
    } else {
        console.info(`🤷‍♀️ could not find an error`);
    }
    return error;
};

module.exports = {extractErrorRequest};
