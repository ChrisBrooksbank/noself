import { logger } from '@utils/logger.js';
import { loadConfig } from '@config/loader.js';
import { start } from '@core/router.js';

const config = loadConfig();

if (config.debug) {
    logger.setDebugMode(true);
}

logger.setLevel(config.logLevel);
logger.info(`${config.appTitle} started`);

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app element not found');

start((route) => {
    logger.debug('Route', route);

    switch (route.type) {
        case 'home':
            app.innerHTML = `<h1>${config.appTitle}</h1>`;
            break;
        case 'catalog':
            app.innerHTML = `<p>Catalog — coming soon</p>`;
            break;
        case 'concept':
            app.innerHTML = `<p>Concept: ${route.id}</p>`;
            break;
        default:
            app.innerHTML = `<p>Not found</p>`;
    }
});
