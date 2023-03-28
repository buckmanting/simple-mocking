const buildMockPath = (request, basePath) => {
    // split get the left hand side of the path
    const splitUrl = request.originalUrl.split('/');
    const initialPath = splitUrl
        .slice(0, splitUrl.length - 1)
        .filter(value => {
            return /\S/.test(value);
        })
        .join('/');

    // remove the query params
    let fileName = splitUrl[splitUrl.length - 1];
    let cleanedFileName = fileName
        // remove the query params
        .split('?')[0]
        // remove any id selector param
        .split('#')[0];

    // build and return the response
    return `${basePath}/${initialPath}/${request.method}/${cleanedFileName}`;
};

module.exports = {buildMockPath};
