const { logLevels, loggerLevel } = require('./config');

const valid = level => validAt => (level >= validAt ? null : () => {});

function logger(level) {
    const useLevel = valid(levelMapping[level]);

    return {
        error: useLevel(1) || log('error'),
        info: useLevel(2) || log('info'),
        debug: useLevel(3) || log('debug'),
        level: loggerLevel,
    };

    function log(method = '') {
        const logDetails = console[method]; // eslint-disable-line no-console
        return (message = '', details) => {
            logDetails(
                JSON.stringify({
                    [method]: message,
                    details,
                }),
            );
        };
    }
}

const levelMapping = {
    [logLevels.ERROR]: 1,
    [logLevels.INFO]: 2,
    [logLevels.DEBUG]: 3,
};

module.exports = logger(loggerLevel);
