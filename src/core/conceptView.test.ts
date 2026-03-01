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
        if (id === 'anicca') {
            return {
                id: 'anicca',
                title: 'Impermanence',
                pali: 'Anicca',
                sanskrit: null,
                category: 'three-marks',
                related: [],
                brief: 'All conditioned phenomena are impermanent.',
                essentials: 'Essentials.',
                deep: 'Deep.',
                examples: [],
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

const mockMarkViewed = vi.fn();
const mockMarkContemplated = vi.fn();
const mockMarkRevisit = vi.fn();
let mockStatus: 'viewed' | 'contemplated' | 'revisit' | null = null;

vi.mock('./readingHistory.js', () => ({
    markViewed: (id: string) => mockMarkViewed(id),
    markContemplated: (id: string) => {
        mockMarkContemplated(id);
        mockStatus = 'contemplated';
    },
    markRevisit: (id: string) => {
        mockMarkRevisit(id);
        mockStatus = 'revisit';
    },
    getStatus: () => mockStatus,
}));

describe('renderConceptView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        mockStatus = null;
        mockMarkViewed.mockClear();
        mockMarkContemplated.mockClear();
        mockMarkRevisit.mockClear();
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
        // 'anicca' resolves to title 'Impermanence'; 'dukkha' is unknown so shows raw id
        expect(related?.textContent).toContain('Impermanence');
        expect(related?.textContent).toContain('dukkha');
    });

    it('renders related concepts as clickable hash links', () => {
        renderConceptView(container, 'anatta');
        const links = container.querySelectorAll('.concept-related__link');
        expect(links.length).toBe(2);
        const hrefs = Array.from(links).map((l) => l.getAttribute('href'));
        expect(hrefs).toContain('#/concept/anicca');
        expect(hrefs).toContain('#/concept/dukkha');
    });

    it('renders related concept title when concept exists', () => {
        renderConceptView(container, 'anatta');
        const links = Array.from(container.querySelectorAll('.concept-related__link'));
        const aniccaLink = links.find(
            (l) => l.getAttribute('href') === '#/concept/anicca',
        );
        expect(aniccaLink?.textContent).toBe('Impermanence');
    });

    it('falls back to concept ID as link label when concept is unknown', () => {
        renderConceptView(container, 'anatta');
        const links = Array.from(container.querySelectorAll('.concept-related__link'));
        // 'dukkha' is not in the mock, so label should be the raw ID
        const dukkhaLink = links.find(
            (l) => l.getAttribute('href') === '#/concept/dukkha',
        );
        expect(dukkhaLink?.textContent).toBe('dukkha');
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

    it('calls markViewed when rendering a valid concept', () => {
        renderConceptView(container, 'anatta');
        expect(mockMarkViewed).toHaveBeenCalledWith('anatta');
    });

    it('does not call markViewed for an unknown concept', () => {
        renderConceptView(container, 'nonexistent');
        expect(mockMarkViewed).not.toHaveBeenCalled();
    });

    describe('practice toggle buttons', () => {
        it('renders contemplated and revisit buttons', () => {
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector('.js-toggle-contemplated');
            const revisitBtn = container.querySelector('.js-toggle-revisit');
            expect(contemBtn).not.toBeNull();
            expect(revisitBtn).not.toBeNull();
        });

        it('buttons are not active when status is null', () => {
            mockStatus = null;
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            const revisitBtn =
                container.querySelector<HTMLButtonElement>('.js-toggle-revisit');
            expect(contemBtn?.classList.contains('btn-primary')).toBe(false);
            expect(revisitBtn?.classList.contains('btn-primary')).toBe(false);
            expect(contemBtn?.getAttribute('aria-pressed')).toBe('false');
            expect(revisitBtn?.getAttribute('aria-pressed')).toBe('false');
        });

        it('contemplated button is active when status is contemplated', () => {
            mockStatus = 'contemplated';
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            const revisitBtn =
                container.querySelector<HTMLButtonElement>('.js-toggle-revisit');
            expect(contemBtn?.classList.contains('btn-primary')).toBe(true);
            expect(contemBtn?.getAttribute('aria-pressed')).toBe('true');
            expect(revisitBtn?.classList.contains('btn-primary')).toBe(false);
            expect(revisitBtn?.getAttribute('aria-pressed')).toBe('false');
        });

        it('revisit button is active when status is revisit', () => {
            mockStatus = 'revisit';
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            const revisitBtn =
                container.querySelector<HTMLButtonElement>('.js-toggle-revisit');
            expect(revisitBtn?.classList.contains('btn-primary')).toBe(true);
            expect(revisitBtn?.getAttribute('aria-pressed')).toBe('true');
            expect(contemBtn?.classList.contains('btn-primary')).toBe(false);
        });

        it('clicking contemplated button calls markContemplated', () => {
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            contemBtn?.click();
            expect(mockMarkContemplated).toHaveBeenCalledWith('anatta');
        });

        it('clicking revisit button calls markRevisit', () => {
            renderConceptView(container, 'anatta');
            const revisitBtn =
                container.querySelector<HTMLButtonElement>('.js-toggle-revisit');
            revisitBtn?.click();
            expect(mockMarkRevisit).toHaveBeenCalledWith('anatta');
        });

        it('clicking contemplated updates button to active state', () => {
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            contemBtn?.click();
            expect(contemBtn?.classList.contains('btn-primary')).toBe(true);
            expect(contemBtn?.getAttribute('aria-pressed')).toBe('true');
        });

        it('clicking revisit deactivates contemplated button', () => {
            mockStatus = 'contemplated';
            renderConceptView(container, 'anatta');
            const contemBtn = container.querySelector<HTMLButtonElement>(
                '.js-toggle-contemplated',
            );
            const revisitBtn =
                container.querySelector<HTMLButtonElement>('.js-toggle-revisit');
            revisitBtn?.click();
            expect(revisitBtn?.classList.contains('btn-primary')).toBe(true);
            expect(contemBtn?.classList.contains('btn-primary')).toBe(false);
        });
    });
});
