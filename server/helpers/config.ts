const logLevels = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

const exported = {
    logLevels,
    loggerLevel: process.env.LOG_LEVEL || logLevels.INFO,
    port: process.env.PORT || 6371,
    env: process.env.NODE_ENV || 'production'
};

export default exported;
export { logLevels };

export const {
    loggerLevel,
    port,
    env
} = exported;
