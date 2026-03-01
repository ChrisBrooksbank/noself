import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPujaStudyView } from './pujaStudyView.js';
import type { Puja } from '../../content/pujas/index.js';

const mockPuja: Puja = {
    id: 'sevenfold-puja',
    title: 'The Sevenfold Puja',
    tradition: 'Triratna',
    description: 'A devotional liturgy in seven movements.',
    sections: [
        {
            id: 'worship',
            order: 1,
            title: 'Worship',
            original: 'Vandami buddham...',
            originalLanguage: 'Sanskrit',
            translation: 'I worship the Buddha...',
            commentary: 'This section opens the puja with reverence.',
            relatedConcepts: ['three-jewels'],
        },
        {
            id: 'going-for-refuge',
            order: 2,
            title: 'Going for Refuge',
            original: 'Buddham saranam gacchami...',
            originalLanguage: 'Pali',
            translation: 'I go for refuge to the Buddha...',
            commentary: 'The three refuges are affirmed.',
            relatedConcepts: [],
        },
    ],
    ritualSteps: [],
};

vi.mock('../../content/pujas/index.js', () => ({
    getPujaById: vi.fn((id: string) => (id === 'sevenfold-puja' ? mockPuja : undefined)),
}));

vi.mock('../../content/concepts/index.js', () => ({
    getConceptById: vi.fn((id: string) => {
        if (id === 'three-jewels') return { id: 'three-jewels', title: 'Three Jewels' };
        return undefined;
    }),
}));

describe('renderPujaStudyView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders not-found message for unknown id', () => {
        renderPujaStudyView(container, 'unknown-puja');
        expect(container.textContent).toContain('Puja not found');
        expect(container.textContent).toContain('unknown-puja');
    });

    it('renders the puja title', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const title = container.querySelector('.puja-study__title');
        expect(title?.textContent).toBe('The Sevenfold Puja');
    });

    it('renders the puja tradition as badge', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const badge = container.querySelector('.badge');
        expect(badge?.textContent).toBe('Triratna');
    });

    it('renders the puja description', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const desc = container.querySelector('.puja-study__desc');
        expect(desc?.textContent).toBe('A devotional liturgy in seven movements.');
    });

    it('renders a perform ritual link', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const link = container.querySelector('.puja-study__perform-link');
        expect(link?.getAttribute('href')).toBe('#/practice/puja/sevenfold-puja/perform');
    });

    it('renders a back link to pujas list', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/practice/pujas');
    });

    it('renders all sections', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const sections = container.querySelectorAll('.puja-section');
        expect(sections.length).toBe(2);
    });

    it('renders section titles', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const titles = Array.from(container.querySelectorAll('.puja-section__title')).map(
            (el) => el.textContent,
        );
        expect(titles).toContain('Worship');
        expect(titles).toContain('Going for Refuge');
    });

    it('renders original text in each section', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const originals = Array.from(
            container.querySelectorAll('.puja-section__original-text'),
        ).map((el) => el.textContent);
        expect(originals).toContain('Vandami buddham...');
        expect(originals).toContain('Buddham saranam gacchami...');
    });

    it('renders original language in each section', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const langs = Array.from(
            container.querySelectorAll('.puja-section__original-lang'),
        ).map((el) => el.textContent);
        expect(langs).toContain('Sanskrit');
        expect(langs).toContain('Pali');
    });

    it('renders translation text', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const translations = Array.from(
            container.querySelectorAll('.puja-section__translation-text'),
        ).map((el) => el.textContent);
        expect(translations).toContain('I worship the Buddha...');
    });

    it('renders commentary text', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const commentaries = Array.from(
            container.querySelectorAll('.puja-section__commentary-text'),
        ).map((el) => el.textContent);
        expect(commentaries).toContain('This section opens the puja with reverence.');
    });

    it('renders related concept links when present', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const link = container.querySelector('.puja-section__concept-link');
        expect(link?.getAttribute('href')).toBe('#/concept/three-jewels');
        expect(link?.textContent).toBe('Three Jewels');
    });

    it('renders sections in order', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const titles = Array.from(container.querySelectorAll('.puja-section__title')).map(
            (el) => el.textContent,
        );
        expect(titles[0]).toBe('Worship');
        expect(titles[1]).toBe('Going for Refuge');
    });
});
