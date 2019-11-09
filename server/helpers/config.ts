export const logLevels = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

export const loggerLevel = process.env.LOG_LEVEL || logLevels.INFO;

export const port = process.env.PORT || 6371;

export const env = process.env.NODE_ENV || 'production';
