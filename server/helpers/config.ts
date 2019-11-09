const logLevels = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

module.exports = {
    logLevels,
    loggerLevel: process.env.LOG_LEVEL || logLevels.INFO,
    port: process.env.PORT || 6371,
    env: process.env.NODE_ENV || 'production',
};
