import { logger } from '@utils/logger.js';
import { loadConfig } from '@config/loader.js';
import { start } from '@core/router.js';
import { renderNav, initOnlineStatus } from '@core/nav.js';
import { initInstallPrompt } from '@core/installPrompt.js';
import { initUpdatePrompt } from '@core/updatePrompt.js';
import { initPreferences, getExpertiseLevel } from '@core/preferences.js';
import { initSettingsPanel } from '@core/settingsPanel.js';
import { renderHomeView } from '@core/homeView.js';
import { renderCatalogView } from '@core/catalogView.js';
import { renderConceptView } from '@core/conceptView.js';
import { renderPracticeHubView } from '@core/practice/practiceHubView.js';
import { renderMeditationListView } from '@core/practice/meditationListView.js';
import { renderPromptsView } from '@core/practice/promptsView.js';
import { renderPathsListView } from '@core/practice/pathsListView.js';
import { renderPathDetailView } from '@core/practice/pathDetailView.js';
import { renderMeditationSessionView } from '@core/practice/meditationSessionView.js';
import { renderSutrasListView } from '@core/sutrasListView.js';
import { renderSutraStudyView } from '@core/sutraStudyView.js';
import { renderPujaPerformView } from '@core/practice/pujaPerformView.js';
import { renderMantraListView } from '@core/practice/mantraListView.js';
import { renderMantraDetailView } from '@core/practice/mantraDetailView.js';
import { renderPujaListView } from '@core/practice/pujaListView.js';
import { renderPujaStudyView } from '@core/practice/pujaStudyView.js';

const config = loadConfig();

if (config.debug) {
    logger.setDebugMode(true);
}

logger.setLevel(config.logLevel);
logger.info(`${config.appTitle} started`);

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app element not found');

initPreferences();

app.innerHTML = `
    <div id="nav-host"></div>
    <div id="install-host"></div>
    <div id="update-host"></div>
    <div id="settings-host"></div>
    <div id="view-host"></div>`;

const navHost = app.querySelector<HTMLElement>('#nav-host')!;
const installHost = app.querySelector<HTMLElement>('#install-host')!;
const viewHost = app.querySelector<HTMLElement>('#view-host')!;

initOnlineStatus(navHost);
initInstallPrompt(installHost);

const updateHost = app.querySelector<HTMLElement>('#update-host')!;
initUpdatePrompt(updateHost);

const settingsHost = app.querySelector<HTMLElement>('#settings-host')!;
initSettingsPanel(settingsHost);

let currentCleanup: (() => void) | null = null;

start((route) => {
    logger.debug('Route', route);

    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

    const level = getExpertiseLevel();

    // Route guards: redirect level-gated content to home
    const sutraRoutes = ['sutras', 'sutraDetail'] as const;
    const mantraRoutes = [
        'practiceMantras',
        'practiceMantraDetail',
        'practiceMantraChant',
    ] as const;
    const pujaRoutes = [
        'practicePujas',
        'practicePujaStudy',
        'practicePujaPerform',
    ] as const;

    if (
        (sutraRoutes.includes(route.type as (typeof sutraRoutes)[number]) && level < 2) ||
        (mantraRoutes.includes(route.type as (typeof mantraRoutes)[number]) &&
            level < 2) ||
        (pujaRoutes.includes(route.type as (typeof pujaRoutes)[number]) && level < 3)
    ) {
        window.location.hash = '#/';
        return;
    }

    renderNav(navHost, route.type);

    switch (route.type) {
        case 'home':
            renderHomeView(viewHost);
            break;
        case 'catalog':
            renderCatalogView(viewHost);
            break;
        case 'concept':
            currentCleanup = renderConceptView(viewHost, route.id);
            break;
        case 'sutras':
            renderSutrasListView(viewHost);
            break;
        case 'sutraDetail':
            currentCleanup = renderSutraStudyView(viewHost, route.id);
            break;
        case 'practice':
            renderPracticeHubView(viewHost);
            break;
        case 'practiceMediate':
            renderMeditationListView(viewHost);
            break;
        case 'practiceMeditateSession':
            currentCleanup = renderMeditationSessionView(viewHost, route.id);
            break;
        case 'practicePrompts':
            renderPromptsView(viewHost);
            break;
        case 'practicePaths':
            renderPathsListView(viewHost);
            break;
        case 'practicePathDetail':
            renderPathDetailView(viewHost, route.id);
            break;
        case 'practiceHistory':
            viewHost.innerHTML = `
                <div class="page stack" role="main">
                    <h1>Practice History</h1>
                    <p>Coming soon.</p>
                </div>`;
            break;
        case 'practicePujas':
            renderPujaListView(viewHost);
            break;
        case 'practicePujaStudy':
            currentCleanup = renderPujaStudyView(viewHost, route.id);
            break;
        case 'practicePujaPerform':
            currentCleanup = renderPujaPerformView(viewHost, route.id);
            break;
        case 'practiceMantras':
            renderMantraListView(viewHost);
            break;
        case 'practiceMantraDetail':
            renderMantraDetailView(viewHost, route.id);
            break;
        case 'practiceMantraChant':
            currentCleanup = (() => {
                viewHost.innerHTML = `
                    <div class="page stack" role="main">
                        <h1>Mantra Chant</h1>
                        <p>Coming soon.</p>
                    </div>`;
                return () => {};
            })();
            break;
        default:
            viewHost.innerHTML = `
                <div class="page stack" role="main">
                    <p>Page not found.</p>
                    <a href="#/">Return home</a>
                </div>`;
    }
});
