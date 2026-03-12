import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderSutraStudyView } from './sutraStudyView.js';

vi.mock('./preferences.js', () => ({
    getExpertiseLevel: vi.fn(() => 3),
}));

vi.mock('./sacredTerms.js', () => ({
    renderSacredTermSpan: (term: { text: string; language: string }) =>
        `<span class="sacred-term" data-language="${term.language}">${term.text}</span>`,
    initSacredTermTooltips: () => vi.fn(),
}));

describe('renderSutraStudyView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders heart sutra title', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const title = container.querySelector('.sutra-study__title');
        expect(title?.textContent).toBe('Heart Sutra');
    });

    it('renders Sanskrit name as interactive term when terms data is present', () => {
        renderSutraStudyView(container, 'heart-sutra');
        // heart-sutra has terms.sanskrit, so it renders as .sutra-study__terms with a sacred-term span
        const termsEl = container.querySelector('.sutra-study__terms');
        expect(termsEl).toBeTruthy();
        const sacredTerm = termsEl?.querySelector('.sacred-term');
        expect(sacredTerm?.textContent).toContain('Prajñāpāramitāhṛdaya');
    });

    it('renders table of contents', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const toc = container.querySelector('.sutra-toc');
        expect(toc).toBeTruthy();
        const items = toc?.querySelectorAll('li');
        expect(items?.length).toBe(9);
    });

    it('renders all 9 sections', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const sections = container.querySelectorAll('.sutra-section');
        expect(sections.length).toBe(9);
    });

    it('each section has original text', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const originals = container.querySelectorAll('.sutra-section__original');
        expect(originals.length).toBe(9);
    });

    it('each section has translation', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const translations = container.querySelectorAll('.sutra-section__translation');
        expect(translations.length).toBe(9);
    });

    it('each section has expandable commentary', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const details = container.querySelectorAll('.sutra-section__commentary-details');
        expect(details.length).toBe(9);
    });

    it('renders related concept links', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const related = container.querySelectorAll('.sutra-section__related');
        expect(related.length).toBeGreaterThan(0);
    });

    it('renders back link to sutras list', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const backLink = container.querySelector('.back-link');
        expect(backLink?.getAttribute('href')).toBe('#/sutras');
    });

    it('renders ornamental dividers between sections', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const ornaments = container.querySelectorAll('.ornament');
        expect(ornaments.length).toBe(8);
    });

    it('shows not found for unknown sutra', () => {
        renderSutraStudyView(container, 'nonexistent');
        expect(container.textContent).toContain('Sutra not found');
    });

    it('renders interactive sacred term span for sutra terms', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const terms = container.querySelectorAll('.sacred-term');
        expect(terms.length).toBeGreaterThan(0);
    });

    it('renders gloss details for sections that have gloss data', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const glossDetails = container.querySelectorAll('.sutra-section__gloss-details');
        expect(glossDetails.length).toBeGreaterThan(0);
    });

    it('renders gloss table with word-by-word entries', () => {
        renderSutraStudyView(container, 'heart-sutra');
        const glossTable = container.querySelector('.sutra-section__gloss-table');
        expect(glossTable).toBeTruthy();
        const rows = glossTable?.querySelectorAll('tbody tr');
        expect(rows && rows.length).toBeGreaterThan(0);
    });

    it('returns a cleanup function', () => {
        const cleanup = renderSutraStudyView(container, 'heart-sutra');
        expect(typeof cleanup).toBe('function');
    });

    it('not-found path returns a cleanup function', () => {
        const cleanup = renderSutraStudyView(container, 'nonexistent');
        expect(typeof cleanup).toBe('function');
    });
});
