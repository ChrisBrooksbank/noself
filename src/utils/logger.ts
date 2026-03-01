export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

let currentLevel: LogLevel = 'info';
let debugMode = false;

function timestamp(): string {
    return new Date().toISOString();
}

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
    const prefix = `[${timestamp()}] [${level.toUpperCase()}]`;
    const parts = [prefix, message, ...args.map((a) => JSON.stringify(a))];
    return parts.join(' ');
}

export const logger = {
    debug(message: string, ...args: unknown[]): void {
        if (shouldLog('debug')) {
            console.debug(formatMessage('debug', message, ...args));
        }
    },

    info(message: string, ...args: unknown[]): void {
        if (shouldLog('info')) {
            console.info(formatMessage('info', message, ...args));
        }
    },

    warn(message: string, ...args: unknown[]): void {
        if (shouldLog('warn')) {
            console.warn(formatMessage('warn', message, ...args));
        }
    },

    error(message: string, ...args: unknown[]): void {
        if (shouldLog('error')) {
            console.error(formatMessage('error', message, ...args));
        }
    },

    setLevel(level: LogLevel): void {
        currentLevel = level;
    },

    setDebugMode(enabled: boolean): void {
        debugMode = enabled;
        if (enabled) {
            currentLevel = 'debug';
        }
    },

    isDebugMode(): boolean {
        return debugMode;
    },
};
