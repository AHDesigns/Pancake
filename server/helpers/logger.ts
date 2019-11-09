import { logLevels, loggerLevel } from './config';

const valid = (level: number) => (validAt: number): null | (() => void) => (level >= validAt ? null : (): void => {});

interface Logger {
    error(message: any, details?: any): void;
    info(message: any, details?: any): void;
    debug(message: any, details?: any): void;
    level: string;
}

function logger(level: string): Logger {
    const useLevel = valid(levelMapping[level]);

    return {
        error: useLevel(1) || log('error'),
        info: useLevel(2) || log('info'),
        debug: useLevel(3) || log('debug'),
        level: loggerLevel,
    };

    function log(method: 'error' | 'info' | 'debug'): (message: any, details?: any) => void {
        const logDetails = console[method]; // eslint-disable-line no-console
        return (message: any, details?: any): void => {
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

export default logger(loggerLevel);
