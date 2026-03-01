import { logger } from '@utils/logger.js';
import { loadConfig } from '@config/loader.js';

const config = loadConfig();

if (config.debug) {
    logger.setDebugMode(true);
}

logger.setLevel(config.logLevel);
logger.info(`${config.appTitle} started`);

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
    app.innerHTML = `<h1>${config.appTitle}</h1>`;
}
