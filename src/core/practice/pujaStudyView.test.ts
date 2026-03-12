import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPujaStudyView } from './pujaStudyView.js';
import type { Puja } from '../../content/pujas/index.js';

const mockPuja: Puja = {
    id: 'sevenfold-puja',
    title: 'The Sevenfold Puja',
    tradition: 'Triratna',
    description: 'A devotional liturgy in seven movements.',
    terms: {
        pali: {
            text: 'Sattavidhā Pūjā',
            language: 'pali',
            literal: 'Sevenfold Worship',
            etymology: 'satta + vidhā + pūjā',
            phonetic: 'SAHT-tah-VEE-dah POO-jah',
        },
        sanskrit: {
            text: 'Saptavidhā Pūjā',
            language: 'sanskrit',
            literal: 'Sevenfold Worship',
            etymology: 'sapta + vidhā + pūjā',
            phonetic: 'SAHP-tah-VEE-dah POO-jah',
        },
    },
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
            phonetic: 'VAN-da-mi BOOD-dham...',
            gloss: [
                { word: 'vandami', meaning: 'I worship', phonetic: 'VAN-da-mi' },
                { word: 'buddham', meaning: 'the Buddha', phonetic: 'BOOD-dham' },
            ],
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

vi.mock('../preferences.js', () => ({
    getShowVideoLinks: vi.fn(() => true),
}));

vi.mock('../sacredTerms.js', () => ({
    renderSacredTermSpan: (term: { text: string; language: string }) =>
        `<span class="sacred-term" data-language="${term.language}">${term.text}</span>`,
    initSacredTermTooltips: () => vi.fn(),
}));

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

    it('renders interactive sacred term spans when terms data is present', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const termsEl = container.querySelector('.puja-study__terms');
        expect(termsEl).toBeTruthy();
        const sacredTerms = termsEl?.querySelectorAll('.sacred-term');
        expect(sacredTerms?.length).toBe(2);
        const texts = Array.from(sacredTerms ?? []).map((el) => el.textContent);
        expect(texts).toContain('Sattavidhā Pūjā');
        expect(texts).toContain('Saptavidhā Pūjā');
    });

    it('renders word-by-word gloss details for sections that have gloss data', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const glossDetails = container.querySelectorAll('.puja-section__gloss-details');
        expect(glossDetails.length).toBe(1);
    });

    it('renders gloss table rows', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const rows = container.querySelectorAll('.puja-section__gloss-word');
        expect(rows.length).toBe(2);
        const words = Array.from(rows).map((el) => el.textContent);
        expect(words).toContain('vandami');
        expect(words).toContain('buddham');
    });

    it('renders phonetic line for sections with phonetic data', () => {
        renderPujaStudyView(container, 'sevenfold-puja');
        const phonetic = container.querySelector('.puja-section__phonetic');
        expect(phonetic).toBeTruthy();
        expect(phonetic?.textContent).toContain('VAN-da-mi');
    });

    it('returns a cleanup function', () => {
        const cleanup = renderPujaStudyView(container, 'sevenfold-puja');
        expect(typeof cleanup).toBe('function');
    });

    it('returns a cleanup function for not-found puja', () => {
        const cleanup = renderPujaStudyView(container, 'unknown-puja');
        expect(typeof cleanup).toBe('function');
    });
});
