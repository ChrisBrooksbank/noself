import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderNav, initOnlineStatus } from './nav.js';

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
        const homeLink = container.querySelector<HTMLAnchorElement>(
            'a[href="#/"].site-nav__link',
        );
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

    it('renders a Practice link', () => {
        renderNav(container, 'home');
        const practiceLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/practice"]');
        expect(practiceLink).not.toBeNull();
        expect(practiceLink?.textContent?.trim()).toBe('Practice');
    });

    it('marks Practice link as active on practice route', () => {
        renderNav(container, 'practice');
        const practiceLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/practice"]');
        expect(practiceLink?.classList.contains('site-nav__link--active')).toBe(true);
        expect(practiceLink?.getAttribute('aria-current')).toBe('page');
    });

    it('marks Practice link as active on practice sub-routes', () => {
        renderNav(container, 'practiceMediate');
        const practiceLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/practice"]');
        expect(practiceLink?.classList.contains('site-nav__link--active')).toBe(true);
    });

    it('does not mark Practice link as active on home route', () => {
        renderNav(container, 'home');
        const practiceLink =
            container.querySelector<HTMLAnchorElement>('a[href="#/practice"]');
        expect(practiceLink?.classList.contains('site-nav__link--active')).toBe(false);
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

describe('renderNav offline indicator', () => {
    let container: HTMLElement;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('hides offline badge when online', () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        renderNav(container, 'home');
        const badge = container.querySelector('.site-nav__offline-badge');
        expect(badge).not.toBeNull();
        expect(badge?.classList.contains('site-nav__offline-badge--hidden')).toBe(true);
    });

    it('shows offline badge when offline', () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        renderNav(container, 'home');
        const badge = container.querySelector('.site-nav__offline-badge');
        expect(badge).not.toBeNull();
        expect(badge?.classList.contains('site-nav__offline-badge--hidden')).toBe(false);
    });
});

describe('initOnlineStatus', () => {
    let container: HTMLElement;
    let cleanup: () => void;

    beforeEach(() => {
        container = document.createElement('div');
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        renderNav(container, 'home');
    });

    afterEach(() => {
        cleanup?.();
        vi.restoreAllMocks();
    });

    it('shows badge when offline event fires', () => {
        cleanup = initOnlineStatus(container);
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        window.dispatchEvent(new Event('offline'));
        const badge = container.querySelector('.site-nav__offline-badge');
        expect(badge?.classList.contains('site-nav__offline-badge--hidden')).toBe(false);
    });

    it('hides badge when online event fires', () => {
        // Start offline
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        renderNav(container, 'home');
        cleanup = initOnlineStatus(container);
        // Come back online
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        window.dispatchEvent(new Event('online'));
        const badge = container.querySelector('.site-nav__offline-badge');
        expect(badge?.classList.contains('site-nav__offline-badge--hidden')).toBe(true);
    });

    it('returns a cleanup function that removes event listeners', () => {
        cleanup = initOnlineStatus(container);
        cleanup();
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        window.dispatchEvent(new Event('offline'));
        // Badge should still be hidden since listener was removed
        const badge = container.querySelector('.site-nav__offline-badge');
        expect(badge?.classList.contains('site-nav__offline-badge--hidden')).toBe(true);
    });
});
