import { appConfigSchema, type AppConfig } from './schema.js';
import { logger } from '@utils/logger.js';

let cachedConfig: AppConfig | null = null;

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
    const raw = {
        appTitle: import.meta.env.VITE_APP_TITLE ?? 'noself',
        debug: import.meta.env.VITE_DEBUG === 'true',
        logLevel: import.meta.env.VITE_LOG_LEVEL ?? 'info',
        ...overrides,
    };

    const result = appConfigSchema.safeParse(raw);

    if (!result.success) {
        logger.error('Invalid config', result.error.format());
        throw new Error(`Config validation failed: ${result.error.message}`);
    }

    cachedConfig = result.data;
    logger.info('Config loaded', cachedConfig);
    return cachedConfig;
}

export function getConfig(): AppConfig {
    if (!cachedConfig) {
        return loadConfig();
    }
    return cachedConfig;
}

export function resetConfig(): void {
    cachedConfig = null;
}
