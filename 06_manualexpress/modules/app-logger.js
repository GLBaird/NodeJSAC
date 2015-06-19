var log4js = require("log4js");

// setup application logger
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'app.log' }
    ]
});
module.exports = log4js.getLogger();