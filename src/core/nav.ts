import type { Route } from './router.js';
import { toggleSettings } from './settingsPanel.js';
import { getExpertiseLevel } from './preferences.js';

const GEAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;

function navLink(href: string, label: string, active: boolean): string {
    const activeAttr = active
        ? ' aria-current="page" class="site-nav__link site-nav__link--active"'
        : ' class="site-nav__link"';
    return `<li><a href="${href}"${activeAttr}>${label}</a></li>`;
}

export function renderNav(container: HTMLElement, activeType: Route['type']): void {
    const isOffline = !navigator.onLine;
    const level = getExpertiseLevel();
    const offlineClass = isOffline
        ? 'site-nav__offline-badge'
        : 'site-nav__offline-badge site-nav__offline-badge--hidden';
    const sutrasLink =
        level >= 2
            ? navLink(
                  '#/sutras',
                  'Sutras',
                  activeType === 'sutras' || activeType === 'sutraDetail',
              )
            : '';
    container.innerHTML = `
        <nav class="site-nav" aria-label="Main navigation">
            <div class="site-nav__inner page">
                <a href="#/" class="site-nav__brand" aria-label="noself home">noself</a>
                <ul class="site-nav__links" role="list">
                    ${navLink('#/', 'Home', activeType === 'home')}
                    ${navLink('#/catalog', 'Catalog', activeType === 'catalog')}
                    ${sutrasLink}
                    ${navLink('#/practice', 'Practice', activeType.startsWith('practice'))}
                </ul>
                <button class="site-nav__settings-btn" aria-expanded="false" aria-label="Accessibility settings">${GEAR_SVG}</button>
                <span class="${offlineClass}" role="status" aria-live="polite">offline</span>
            </div>
        </nav>`;

    container
        .querySelector('.site-nav__settings-btn')
        ?.addEventListener('click', toggleSettings);
}

export function initOnlineStatus(navHost: HTMLElement): () => void {
    function update(): void {
        const badge = navHost.querySelector<HTMLElement>('.site-nav__offline-badge');
        if (!badge) return;
        if (navigator.onLine) {
            badge.classList.add('site-nav__offline-badge--hidden');
        } else {
            badge.classList.remove('site-nav__offline-badge--hidden');
        }
    }

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
    };
}
