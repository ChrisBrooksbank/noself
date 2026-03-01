import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderMantraListView } from './mantraListView.js';
import type { Mantra } from '../../content/mantras/index.js';

const mockMantras: Mantra[] = [
    {
        id: 'avalokiteshvara',
        title: 'Avalokiteshvara Mantra',
        sanskrit: 'Om Mani Padme Hum',
        pali: null,
        tradition: 'Mahayana',
        description: 'The mantra of compassion.',
        syllables: [],
        meaning: 'Hail to the jewel in the lotus.',
        usage: 'Chant with a calm, focused mind.',
        defaultRepetitions: 108,
        relatedConcepts: ['compassion'],
    },
    {
        id: 'green-tara',
        title: 'Green Tara Mantra',
        sanskrit: 'Om Tare Tuttare Ture Svaha',
        pali: null,
        tradition: 'Vajrayana',
        description: 'The mantra of swift liberation.',
        syllables: [],
        meaning: 'Homage to Tara, swift liberator.',
        usage: 'Recite for protection and swift action.',
        defaultRepetitions: 108,
        relatedConcepts: [],
    },
];

vi.mock('../../content/mantras/index.js', () => ({
    loadMantras: vi.fn(() => mockMantras),
}));

describe('renderMantraListView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the heading', () => {
        renderMantraListView(container);
        const heading = container.querySelector('.mantra-list__heading');
        expect(heading?.textContent).toBe('Mantras');
    });

    it('renders a list item for each mantra', () => {
        renderMantraListView(container);
        const items = container.querySelectorAll('.mantra-item');
        expect(items.length).toBe(2);
    });

    it('renders each mantra title', () => {
        renderMantraListView(container);
        const titles = Array.from(container.querySelectorAll('.mantra-item__title')).map(
            (el) => el.textContent,
        );
        expect(titles).toContain('Avalokiteshvara Mantra');
        expect(titles).toContain('Green Tara Mantra');
    });

    it('renders each mantra sanskrit text', () => {
        renderMantraListView(container);
        const sanskrits = Array.from(
            container.querySelectorAll('.mantra-item__sanskrit'),
        ).map((el) => el.textContent);
        expect(sanskrits).toContain('Om Mani Padme Hum');
        expect(sanskrits).toContain('Om Tare Tuttare Ture Svaha');
    });

    it('renders each mantra tradition', () => {
        renderMantraListView(container);
        const traditions = Array.from(
            container.querySelectorAll('.mantra-item__tradition'),
        ).map((el) => el.textContent);
        expect(traditions).toContain('Mahayana');
        expect(traditions).toContain('Vajrayana');
    });

    it('renders detail links for each mantra', () => {
        renderMantraListView(container);
        const detailLinks = container.querySelectorAll('.mantra-item__detail-link');
        expect(detailLinks.length).toBe(2);
    });

    it('renders detail links with correct hrefs', () => {
        renderMantraListView(container);
        const hrefs = Array.from(
            container.querySelectorAll('.mantra-item__detail-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/practice/mantra/avalokiteshvara');
        expect(hrefs).toContain('#/practice/mantra/green-tara');
    });

    it('renders chant links for each mantra', () => {
        renderMantraListView(container);
        const chantLinks = container.querySelectorAll('.mantra-item__chant-link');
        expect(chantLinks.length).toBe(2);
    });

    it('renders chant links with correct hrefs', () => {
        renderMantraListView(container);
        const hrefs = Array.from(
            container.querySelectorAll('.mantra-item__chant-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/practice/mantra/avalokiteshvara/chant');
        expect(hrefs).toContain('#/practice/mantra/green-tara/chant');
    });

    it('renders a back link to practice hub', () => {
        renderMantraListView(container);
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice');
    });

    it('renders mantras sorted alphabetically', () => {
        renderMantraListView(container);
        const titles = Array.from(container.querySelectorAll('.mantra-item__title')).map(
            (el) => el.textContent,
        );
        expect(titles[0]).toBe('Avalokiteshvara Mantra');
        expect(titles[1]).toBe('Green Tara Mantra');
    });
});
