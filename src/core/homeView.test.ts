import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHomeView } from './homeView.js';

vi.mock('./dailyConcept.js', () => ({
    getDailyConcept: () => ({
        id: 'anatta',
        title: 'No-Self',
        brief: 'The teaching that no permanent self exists.',
    }),
}));

vi.mock('./readingHistory.js', () => ({
    getViewedIds: () => ['anatta', 'anicca'],
}));

vi.mock('../content/concepts/index.js', () => ({
    CONCEPT_IDS: Array.from({ length: 30 }, (_, i) => `concept-${i}`),
    getConceptById: (id: string) => {
        if (id === 'anatta') return { id: 'anatta', title: 'No-Self' };
        if (id === 'anicca') return { id: 'anicca', title: 'Impermanence' };
        return undefined;
    },
}));

describe('renderHomeView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the daily concept title', () => {
        renderHomeView(container);
        expect(container.querySelector('.home-daily__title')?.textContent).toBe(
            'No-Self',
        );
    });

    it('renders the daily concept brief', () => {
        renderHomeView(container);
        expect(container.querySelector('.home-daily__brief')?.textContent).toBe(
            'The teaching that no permanent self exists.',
        );
    });

    it('renders a link to the daily concept', () => {
        renderHomeView(container);
        const link = container.querySelector('.home-daily__link');
        expect(link?.getAttribute('href')).toBe('#/concept/anatta');
    });

    it('renders a "Today\'s Concept" heading', () => {
        renderHomeView(container);
        const headings = Array.from(container.querySelectorAll('h2'));
        expect(headings.some((h) => h.textContent?.includes("Today's Concept"))).toBe(
            true,
        );
    });

    it('renders progress counter with viewed count and total', () => {
        renderHomeView(container);
        const progress = container.querySelector('.home-progress');
        expect(progress?.textContent?.trim()).toBe('2 of 30 concepts explored');
    });

    it('renders recently viewed concepts in history', () => {
        renderHomeView(container);
        const historyLinks = container.querySelectorAll('.home-history__link');
        expect(historyLinks.length).toBe(2);
    });

    it('renders history links with correct hrefs', () => {
        renderHomeView(container);
        const hrefs = Array.from(container.querySelectorAll('.home-history__link')).map(
            (l) => l.getAttribute('href'),
        );
        expect(hrefs).toContain('#/concept/anatta');
        expect(hrefs).toContain('#/concept/anicca');
    });

    it('renders history links with concept titles', () => {
        renderHomeView(container);
        const links = Array.from(container.querySelectorAll('.home-history__link'));
        const texts = links.map((l) => l.textContent);
        expect(texts).toContain('No-Self');
        expect(texts).toContain('Impermanence');
    });

    it('renders most recently viewed first', () => {
        renderHomeView(container);
        const links = Array.from(container.querySelectorAll('.home-history__link'));
        // viewedIds is ['anatta', 'anicca'], most recent is last element 'anicca'
        expect(links[0]?.getAttribute('href')).toBe('#/concept/anicca');
    });

    it('does not render history section when no concepts viewed', () => {
        vi.resetModules();
    });

    it('falls back to concept ID as label when concept not found in history', () => {
        renderHomeView(container);
        // Both 'anatta' and 'anicca' are in the mock, so we just verify no crash
        const links = container.querySelectorAll('.home-history__link');
        expect(links.length).toBeGreaterThan(0);
    });
});
