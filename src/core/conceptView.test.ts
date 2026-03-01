import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderConceptView } from './conceptView.js';

vi.mock('../content/concepts/index.js', () => ({
    getConceptById: (id: string) => {
        if (id === 'anatta') {
            return {
                id: 'anatta',
                title: 'No-Self',
                pali: 'Anattā',
                sanskrit: 'Anātman',
                category: 'three-marks',
                related: ['anicca', 'dukkha'],
                brief: 'The teaching that no permanent self exists.',
                essentials: 'Essentials text here.',
                deep: 'Deep teaching text here.',
                examples: [
                    {
                        source: 'SN 22.59',
                        text: 'Form is not self.',
                        commentary: 'The Buddha addresses the five aggregates.',
                    },
                ],
            };
        }
        if (id === 'no-terms') {
            return {
                id: 'no-terms',
                title: 'No Terms Concept',
                pali: null,
                sanskrit: null,
                category: 'foundational',
                related: [],
                brief: 'Brief.',
                essentials: 'Essentials.',
                deep: 'Deep.',
                examples: [],
            };
        }
        return undefined;
    },
}));

describe('renderConceptView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the concept title', () => {
        renderConceptView(container, 'anatta');
        expect(container.querySelector('h1')?.textContent).toBe('No-Self');
    });

    it('renders pali and sanskrit terms', () => {
        renderConceptView(container, 'anatta');
        const terms = container.querySelector('.concept-terms');
        expect(terms?.textContent).toContain('Anattā');
        expect(terms?.textContent).toContain('Anātman');
    });

    it('renders category badge', () => {
        renderConceptView(container, 'anatta');
        expect(container.querySelector('.badge')?.textContent).toBe('three-marks');
    });

    it('renders brief text', () => {
        renderConceptView(container, 'anatta');
        expect(container.querySelector('.concept-brief')?.textContent).toBe(
            'The teaching that no permanent self exists.',
        );
    });

    it('renders essentials section', () => {
        renderConceptView(container, 'anatta');
        const headings = Array.from(container.querySelectorAll('h2'));
        const essentialsHeading = headings.find((h) => h.textContent === 'Essentials');
        expect(essentialsHeading).toBeDefined();
    });

    it('renders deep teaching section', () => {
        renderConceptView(container, 'anatta');
        const headings = Array.from(container.querySelectorAll('h2'));
        const deepHeading = headings.find((h) => h.textContent === 'Deep Teaching');
        expect(deepHeading).toBeDefined();
    });

    it('renders examples in blockquotes', () => {
        renderConceptView(container, 'anatta');
        const blockquote = container.querySelector('blockquote');
        expect(blockquote?.textContent).toBe('Form is not self.');
    });

    it('renders example source attribution', () => {
        renderConceptView(container, 'anatta');
        const source = container.querySelector('.concept-example__source');
        expect(source?.textContent).toBe('SN 22.59');
    });

    it('renders example commentary', () => {
        renderConceptView(container, 'anatta');
        const commentary = container.querySelector('.concept-example__commentary');
        expect(commentary?.textContent).toBe('The Buddha addresses the five aggregates.');
    });

    it('renders related concepts', () => {
        renderConceptView(container, 'anatta');
        const related = container.querySelector('.concept-related');
        expect(related?.textContent).toContain('anicca');
        expect(related?.textContent).toContain('dukkha');
    });

    it('does not render terms section when pali and sanskrit are null', () => {
        renderConceptView(container, 'no-terms');
        expect(container.querySelector('.concept-terms')).toBeNull();
    });

    it('does not render examples section when examples are empty', () => {
        renderConceptView(container, 'no-terms');
        const headings = Array.from(container.querySelectorAll('h2'));
        const sourceHeading = headings.find((h) => h.textContent === 'Source Teachings');
        expect(sourceHeading).toBeUndefined();
    });

    it('does not render related section when related is empty', () => {
        renderConceptView(container, 'no-terms');
        expect(container.querySelector('.concept-related')).toBeNull();
    });

    it('renders not-found message for unknown id', () => {
        renderConceptView(container, 'nonexistent');
        expect(container.textContent).toContain('Concept not found');
        expect(container.textContent).toContain('nonexistent');
    });

    it('renders a return home link on not-found', () => {
        renderConceptView(container, 'nonexistent');
        const link = container.querySelector('a');
        expect(link?.getAttribute('href')).toBe('#/');
    });
});
