var logger = require("../modules/app-logger");

// #404 response
exports.notfound404 = function (req, res) {
    res.status(404)
        .send("#404 We do not have whatever you're looking for!");
};

// Log server requests
exports.requestLogger = function (req, res, next) {
    logger.info("Request from IP: "+req.ip+" for URL: "+req.originalUrl);
    next();
};