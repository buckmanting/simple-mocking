const logRequest = () => {
    return (request, response, next) => {
        console.log('📨', request.originalUrl, request.method, request.body);
        next();
    };
}

module.exports = {logRequest};