import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderCatalogView, matchesSearch } from './catalogView.js';

const { mockConcepts, viewedIds } = vi.hoisted(() => {
    const mockConcepts = [
        {
            id: 'anatta',
            title: 'No-Self',
            pali: 'anattā',
            sanskrit: 'anātman',
            category: 'three-marks',
            related: [],
            brief: 'The teaching that no permanent self exists.',
            essentials: '',
            deep: '',
            examples: [],
        },
        {
            id: 'nirvana',
            title: 'Nirvana',
            pali: null,
            sanskrit: 'nirvāṇa',
            category: 'liberation',
            related: [],
            brief: 'The cessation of suffering and desire.',
            essentials: '',
            deep: '',
            examples: [],
        },
    ];
    const viewedIds = new Set<string>();
    return { mockConcepts, viewedIds };
});

vi.mock('../content/concepts/index.js', () => ({
    loadConcepts: () => mockConcepts,
    getConceptById: (id: string) => mockConcepts.find((c) => c.id === id),
    CONCEPT_IDS: mockConcepts.map((c) => c.id),
}));

vi.mock('./readingHistory.js', () => ({
    isViewed: (id: string) => viewedIds.has(id),
}));

describe('renderCatalogView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        viewedIds.clear();
    });

    it('renders a heading', () => {
        renderCatalogView(container);
        expect(container.querySelector('h1')?.textContent?.trim()).toBe('All Concepts');
    });

    it('renders all concepts', () => {
        renderCatalogView(container);
        const items = container.querySelectorAll('.catalog-item');
        expect(items.length).toBe(2);
    });

    it('renders concept titles as links', () => {
        renderCatalogView(container);
        const link = container.querySelector('a.catalog-item__link');
        expect(link?.textContent?.trim()).toBe('No-Self');
        expect(link?.getAttribute('href')).toBe('#/concept/anatta');
    });

    it('renders pali name when present', () => {
        renderCatalogView(container);
        const paliEl = container.querySelector('.catalog-item__pali');
        expect(paliEl?.textContent).toBe('anattā');
    });

    it('does not render pali element when pali is null', () => {
        renderCatalogView(container);
        const items = container.querySelectorAll('.catalog-item');
        // Second concept (nirvana) has no pali
        const paliEls = items[1]?.querySelectorAll('.catalog-item__pali');
        expect(paliEls?.length).toBe(0);
    });

    it('renders concept brief', () => {
        renderCatalogView(container);
        const briefs = container.querySelectorAll('.catalog-item__brief');
        expect(briefs[0]?.textContent).toBe(
            'The teaching that no permanent self exists.',
        );
    });

    it('renders "New" badge for unread concepts', () => {
        renderCatalogView(container);
        const badges = container.querySelectorAll('.catalog-item__badge');
        expect(badges[0]?.textContent?.trim()).toBe('New');
    });

    it('renders "Read" badge for viewed concepts', () => {
        viewedIds.add('anatta');
        renderCatalogView(container);
        const badges = container.querySelectorAll('.catalog-item__badge');
        expect(badges[0]?.textContent?.trim()).toBe('Read');
    });

    it('renders correct links for all concepts', () => {
        renderCatalogView(container);
        const links = Array.from(container.querySelectorAll('a.catalog-item__link'));
        const hrefs = links.map((l) => l.getAttribute('href'));
        expect(hrefs).toContain('#/concept/anatta');
        expect(hrefs).toContain('#/concept/nirvana');
    });

    it('renders a search input', () => {
        renderCatalogView(container);
        const input = container.querySelector<HTMLInputElement>('#catalog-search-input');
        expect(input).toBeTruthy();
        expect(input?.getAttribute('type')).toBe('search');
    });
});

describe('matchesSearch', () => {
    const concept = {
        id: 'anatta',
        title: 'No-Self',
        pali: 'anattā',
        sanskrit: 'anātman',
        category: 'three-marks' as const,
        related: [],
        brief: 'The teaching that no permanent self exists.',
        essentials: '',
        deep: '',
        examples: [],
    };

    it('matches by title (case-insensitive)', () => {
        expect(matchesSearch(concept, 'no-self')).toBe(true);
        expect(matchesSearch(concept, 'NO-SELF')).toBe(true);
    });

    it('matches by pali', () => {
        expect(matchesSearch(concept, 'anattā')).toBe(true);
    });

    it('matches by sanskrit', () => {
        expect(matchesSearch(concept, 'anātman')).toBe(true);
    });

    it('matches by brief content', () => {
        expect(matchesSearch(concept, 'permanent')).toBe(true);
    });

    it('returns false when no field matches', () => {
        expect(matchesSearch(concept, 'nirvana')).toBe(false);
    });

    it('handles null pali gracefully', () => {
        const noPali = { ...concept, pali: null };
        expect(matchesSearch(noPali, 'anattā')).toBe(false);
    });

    it('handles null sanskrit gracefully', () => {
        const noSanskrit = { ...concept, sanskrit: null };
        expect(matchesSearch(noSanskrit, 'anātman')).toBe(false);
    });
});
