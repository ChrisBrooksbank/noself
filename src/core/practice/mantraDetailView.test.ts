import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderMantraDetailView } from './mantraDetailView.js';
import { getMantraById } from '../../content/mantras/index.js';
import type { Mantra } from '../../content/mantras/index.js';

const mockMantra: Mantra = {
    id: 'avalokiteshvara',
    title: 'Avalokiteshvara Mantra',
    sanskrit: 'Om Mani Padme Hum',
    pali: null,
    tradition: 'Mahayana',
    description: 'The mantra of compassion.',
    syllables: [
        { text: 'Om', meaning: 'The sacred syllable.' },
        { text: 'Mani', meaning: 'Jewel — bodhicitta.' },
        { text: 'Padme', meaning: 'Lotus — wisdom.' },
        { text: 'Hum', meaning: 'Indivisibility.' },
    ],
    meaning: 'The jewel in the lotus.',
    usage: 'Chant with a calm, focused mind.',
    defaultRepetitions: 108,
    relatedConcepts: ['compassion', 'sunyata'],
};

vi.mock('../../content/mantras/index.js', () => ({
    getMantraById: vi.fn((id: string) =>
        id === 'avalokiteshvara' ? mockMantra : undefined,
    ),
}));

vi.mock('../../content/concepts/index.js', () => ({
    getConceptById: vi.fn((id: string) => {
        if (id === 'compassion') return { id: 'compassion', title: 'Compassion' };
        if (id === 'sunyata') return { id: 'sunyata', title: 'Sunyata' };
        return undefined;
    }),
}));

describe('renderMantraDetailView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders not-found message for unknown id', () => {
        renderMantraDetailView(container, 'unknown-mantra');
        expect(container.textContent).toContain('Mantra not found');
        expect(container.textContent).toContain('unknown-mantra');
    });

    it('renders the mantra title', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const title = container.querySelector('.mantra-detail__title');
        expect(title?.textContent).toBe('Avalokiteshvara Mantra');
    });

    it('renders the tradition as badge', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const badge = container.querySelector('.badge');
        expect(badge?.textContent).toBe('Mahayana');
    });

    it('renders the mantra description', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const desc = container.querySelector('.mantra-detail__description');
        expect(desc?.textContent).toBe('The mantra of compassion.');
    });

    it('renders the sanskrit text', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const sanskrit = container.querySelector('.mantra-detail__sanskrit');
        expect(sanskrit?.textContent).toBe('Om Mani Padme Hum');
    });

    it('does not render pali element when pali is null', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const pali = container.querySelector('.mantra-detail__pali');
        expect(pali).toBeNull();
    });

    it('renders pali text when present', () => {
        const mantraWithPali: Mantra = {
            ...mockMantra,
            pali: 'Om Mani Padme Hum (Pali)',
        };
        vi.mocked(getMantraById).mockReturnValueOnce(mantraWithPali);
        renderMantraDetailView(container, 'avalokiteshvara');
        const pali = container.querySelector('.mantra-detail__pali');
        expect(pali?.textContent).toBe('Om Mani Padme Hum (Pali)');
    });

    it('renders all syllables', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const syllables = container.querySelectorAll('.mantra-detail__syllable');
        expect(syllables.length).toBe(4);
    });

    it('renders syllable text', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const texts = Array.from(
            container.querySelectorAll('.mantra-detail__syllable-text'),
        ).map((el) => el.textContent);
        expect(texts).toContain('Om');
        expect(texts).toContain('Mani');
        expect(texts).toContain('Padme');
        expect(texts).toContain('Hum');
    });

    it('renders syllable meanings', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const meanings = Array.from(
            container.querySelectorAll('.mantra-detail__syllable-meaning'),
        ).map((el) => el.textContent);
        expect(meanings).toContain('The sacred syllable.');
        expect(meanings).toContain('Jewel — bodhicitta.');
    });

    it('renders the meaning section', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const meaning = container.querySelector('.mantra-detail__meaning-text');
        expect(meaning?.textContent).toBe('The jewel in the lotus.');
    });

    it('renders the usage section', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const usage = container.querySelector('.mantra-detail__usage-text');
        expect(usage?.textContent).toBe('Chant with a calm, focused mind.');
    });

    it('renders related concept links', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const links = container.querySelectorAll('.mantra-detail__concept-link');
        expect(links.length).toBe(2);
    });

    it('renders related concept links with correct hrefs', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const hrefs = Array.from(
            container.querySelectorAll('.mantra-detail__concept-link'),
        ).map((el) => el.getAttribute('href'));
        expect(hrefs).toContain('#/concept/compassion');
        expect(hrefs).toContain('#/concept/sunyata');
    });

    it('renders related concept links with resolved titles', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const texts = Array.from(
            container.querySelectorAll('.mantra-detail__concept-link'),
        ).map((el) => el.textContent);
        expect(texts).toContain('Compassion');
        expect(texts).toContain('Sunyata');
    });

    it('renders a chant link', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const chantLink = container.querySelector('.mantra-detail__chant-link');
        expect(chantLink?.getAttribute('href')).toBe(
            '#/practice/mantra/avalokiteshvara/chant',
        );
    });

    it('renders a back link to mantras list', () => {
        renderMantraDetailView(container, 'avalokiteshvara');
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice/mantras');
    });
});
