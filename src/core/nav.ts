import type { Route } from './router.js';

function navLink(href: string, label: string, active: boolean): string {
    const activeAttr = active
        ? ' aria-current="page" class="site-nav__link site-nav__link--active"'
        : ' class="site-nav__link"';
    return `<li><a href="${href}"${activeAttr}>${label}</a></li>`;
}

export function renderNav(container: HTMLElement, activeType: Route['type']): void {
    const isOffline = !navigator.onLine;
    const offlineClass = isOffline
        ? 'site-nav__offline-badge'
        : 'site-nav__offline-badge site-nav__offline-badge--hidden';
    container.innerHTML = `
        <nav class="site-nav" aria-label="Main navigation">
            <div class="site-nav__inner page">
                <a href="#/" class="site-nav__brand" aria-label="noself home">noself</a>
                <ul class="site-nav__links" role="list">
                    ${navLink('#/', 'Home', activeType === 'home')}
                    ${navLink('#/catalog', 'Catalog', activeType === 'catalog')}
                </ul>
                <span class="${offlineClass}" role="status" aria-live="polite">offline</span>
            </div>
        </nav>`;
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
