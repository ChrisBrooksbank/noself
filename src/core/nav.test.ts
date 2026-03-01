import { describe, it, expect, beforeEach } from 'vitest';
import { renderNav } from './nav.js';

describe('renderNav', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders a nav element', () => {
        renderNav(container, 'home');
        expect(container.querySelector('nav')).not.toBeNull();
    });

    it('renders a Home link', () => {
        renderNav(container, 'home');
        const links = Array.from(container.querySelectorAll('a'));
        const homeLink = links.find((l) => l.getAttribute('href') === '#/');
        expect(homeLink).not.toBeNull();
        expect(homeLink?.textContent?.trim()).toBe('Home');
    });

    it('renders a Catalog link', () => {
        renderNav(container, 'home');
        const links = Array.from(container.querySelectorAll('a'));
        const catalogLink = links.find((l) => l.getAttribute('href') === '#/catalog');
        expect(catalogLink).not.toBeNull();
        expect(catalogLink?.textContent?.trim()).toBe('Catalog');
    });

    it('marks Home link as active on home route', () => {
        renderNav(container, 'home');
        const homeLink = container.querySelector<HTMLAnchorElement>(
            'a[href="#/"].site-nav__link',
        );
        expect(homeLink?.classList.contains('site-nav__link--active')).toBe(true);
        expect(homeLink?.getAttribute('aria-current')).toBe('page');
    });

    it('does not mark Catalog link as active on home route', () => {
        renderNav(container, 'home');
        const catalogLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/catalog"]');
        expect(catalogLink?.classList.contains('site-nav__link--active')).toBe(false);
        expect(catalogLink?.getAttribute('aria-current')).toBeNull();
    });

    it('marks Catalog link as active on catalog route', () => {
        renderNav(container, 'catalog');
        const catalogLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/catalog"]');
        expect(catalogLink?.classList.contains('site-nav__link--active')).toBe(true);
        expect(catalogLink?.getAttribute('aria-current')).toBe('page');
    });

    it('does not mark Home link as active on catalog route', () => {
        renderNav(container, 'catalog');
        const homeLink = container.querySelector<HTMLAnchorElement>(
            'a[href="#/"].site-nav__link',
        );
        expect(homeLink?.classList.contains('site-nav__link--active')).toBe(false);
    });

    it('marks neither link as active on concept route', () => {
        renderNav(container, 'concept');
        const activeLinks = container.querySelectorAll('.site-nav__link--active');
        expect(activeLinks.length).toBe(0);
    });

    it('renders a brand link', () => {
        renderNav(container, 'home');
        const brand = container.querySelector('.site-nav__brand');
        expect(brand).not.toBeNull();
        expect(brand?.getAttribute('href')).toBe('#/');
    });

    it('replaces previous nav on subsequent renders', () => {
        renderNav(container, 'home');
        renderNav(container, 'catalog');
        expect(container.querySelectorAll('nav').length).toBe(1);
        const catalogLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/catalog"]');
        expect(catalogLink?.classList.contains('site-nav__link--active')).toBe(true);
    });
});
