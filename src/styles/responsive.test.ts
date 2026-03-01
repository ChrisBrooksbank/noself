/**
 * Responsive structure tests: verify that rendered views include the CSS classes
 * required for single-column layout and no horizontal overflow on narrow viewports.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderCatalogView } from '../core/catalogView.js';
import { renderHomeView } from '../core/homeView.js';
import { renderConceptView } from '../core/conceptView.js';
import { renderNav } from '../core/nav.js';

vi.mock('../content/concepts/index.js', () => ({
    loadConcepts: () => [
        {
            id: 'anicca',
            title: 'Impermanence',
            pali: 'Anicca',
            sanskrit: 'Anitya',
            category: 'three-marks',
            related: [],
            brief: 'All conditioned phenomena are impermanent.',
            essentials: 'Everything changes.',
            deep: 'Deeper teaching on impermanence.',
            examples: [],
        },
    ],
    getConceptById: (id: string) =>
        id === 'anicca'
            ? {
                  id: 'anicca',
                  title: 'Impermanence',
                  pali: 'Anicca',
                  sanskrit: 'Anitya',
                  category: 'three-marks',
                  related: [],
                  brief: 'All conditioned phenomena are impermanent.',
                  essentials: 'Everything changes.',
                  deep: 'Deeper teaching on impermanence.',
                  examples: [],
              }
            : null,
    CONCEPT_IDS: ['anicca'],
}));

vi.mock('../core/readingHistory.js', () => ({
    isViewed: () => false,
    getViewedIds: () => [],
    markViewed: () => {},
    getStatus: () => null,
    markContemplated: () => {},
    markRevisit: () => {},
}));

vi.mock('../core/dailyConcept.js', () => ({
    getDailyConcept: () => ({
        id: 'anicca',
        title: 'Impermanence',
        brief: 'All conditioned phenomena are impermanent.',
    }),
}));

describe('responsive CSS structure', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    describe('catalog view', () => {
        it('search input has full-width class catalog-search__input', () => {
            renderCatalogView(container);
            const input = container.querySelector('.catalog-search__input');
            expect(input).not.toBeNull();
        });

        it('search container uses catalog-search class', () => {
            renderCatalogView(container);
            expect(container.querySelector('.catalog-search')).not.toBeNull();
        });

        it('concept list uses catalog-list class (no list-style override needed)', () => {
            renderCatalogView(container);
            expect(container.querySelector('.catalog-list')).not.toBeNull();
        });

        it('concept item header uses catalog-item__header for flex-wrap layout', () => {
            renderCatalogView(container);
            expect(container.querySelector('.catalog-item__header')).not.toBeNull();
        });

        it('filter buttons use btn-group class (flex-wrap: wrap)', () => {
            renderCatalogView(container);
            expect(container.querySelector('.btn-group')).not.toBeNull();
        });

        it('view root uses page class for max-width centering', () => {
            renderCatalogView(container);
            expect(container.querySelector('.page')).not.toBeNull();
        });

        it('search label uses sr-only for accessible hidden text', () => {
            renderCatalogView(container);
            const label = container.querySelector('label[for="catalog-search-input"]');
            expect(label?.classList.contains('sr-only')).toBe(true);
        });
    });

    describe('home view', () => {
        it('view root uses page class for max-width centering', () => {
            renderHomeView(container);
            expect(container.querySelector('.page')).not.toBeNull();
        });

        it('daily card uses card class', () => {
            renderHomeView(container);
            expect(container.querySelector('.card')).not.toBeNull();
        });
    });

    describe('concept view', () => {
        it('view root uses page class for max-width centering', () => {
            renderConceptView(container, 'anicca');
            expect(container.querySelector('.page')).not.toBeNull();
        });

        it('practice toggle uses btn-group class (flex-wrap: wrap)', () => {
            renderConceptView(container, 'anicca');
            expect(container.querySelector('.btn-group')).not.toBeNull();
        });
    });

    describe('nav', () => {
        it('nav inner uses page class for constrained width', () => {
            renderNav(container, 'home');
            const inner = container.querySelector('.site-nav__inner');
            expect(inner?.classList.contains('page')).toBe(true);
        });

        it('nav links use site-nav__links class', () => {
            renderNav(container, 'home');
            expect(container.querySelector('.site-nav__links')).not.toBeNull();
        });
    });
});
