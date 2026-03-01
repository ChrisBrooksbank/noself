import type { Route } from './router.js';

function navLink(href: string, label: string, active: boolean): string {
    const activeAttr = active
        ? ' aria-current="page" class="site-nav__link site-nav__link--active"'
        : ' class="site-nav__link"';
    return `<li><a href="${href}"${activeAttr}>${label}</a></li>`;
}

export function renderNav(container: HTMLElement, activeType: Route['type']): void {
    container.innerHTML = `
        <nav class="site-nav" aria-label="Main navigation">
            <div class="site-nav__inner page">
                <a href="#/" class="site-nav__brand" aria-label="noself home">noself</a>
                <ul class="site-nav__links" role="list">
                    ${navLink('#/', 'Home', activeType === 'home')}
                    ${navLink('#/catalog', 'Catalog', activeType === 'catalog')}
                </ul>
            </div>
        </nav>`;
}
