import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPromptsView } from './promptsView.js';
import type { Prompt } from '../../content/prompts/index.js';

const mockPrompts: Prompt[] = [
    {
        id: 'anatta-1',
        conceptId: 'anatta',
        depth: 'beginner',
        question: 'Can you find a fixed self behind your thoughts?',
        guidance: 'Sit quietly and observe thoughts arising and passing.',
    },
    {
        id: 'anatta-2',
        conceptId: 'anatta',
        depth: 'intermediate',
        question: 'Who is aware of the observer?',
        guidance: 'Turn attention back on the one who is watching.',
    },
    {
        id: 'anicca-1',
        conceptId: 'anicca',
        depth: 'beginner',
        question: 'What in your experience is truly permanent?',
        guidance: 'Notice the constant flux of sensation and thought.',
    },
];

const mockDailyPrompt: Prompt = mockPrompts[0]!;

vi.mock('./dailyPrompt.js', () => ({
    getDailyPrompt: vi.fn(() => mockDailyPrompt),
}));

vi.mock('../../content/prompts/loader.js', () => ({
    getAllPrompts: vi.fn(() => mockPrompts),
}));

vi.mock('../practiceHistory.js', () => ({
    logPromptSatWith: vi.fn(),
    isPromptSatWith: vi.fn(() => false),
}));

import * as practiceHistory from '../practiceHistory.js';

describe('renderPromptsView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        vi.mocked(practiceHistory.isPromptSatWith).mockReturnValue(false);
    });

    it('renders the heading', () => {
        renderPromptsView(container);
        const heading = container.querySelector('.prompts__heading');
        expect(heading?.textContent).toBe('Contemplate');
    });

    it('renders a back link to practice hub', () => {
        renderPromptsView(container);
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice');
    });

    it("renders the daily prompt section with today's prompt heading", () => {
        renderPromptsView(container);
        const headings = Array.from(
            container.querySelectorAll('.prompts-section__heading'),
        );
        expect(headings.some((h) => h.textContent?.includes("Today's Prompt"))).toBe(
            true,
        );
    });

    it('renders the daily prompt question', () => {
        renderPromptsView(container);
        const question = container.querySelector('.prompts-daily__question');
        expect(question?.textContent).toBe(
            'Can you find a fixed self behind your thoughts?',
        );
    });

    it('renders the daily prompt concept ID', () => {
        renderPromptsView(container);
        const concept = container.querySelector('.prompt-card__concept');
        expect(concept?.textContent).toBe('anatta');
    });

    it('renders the daily prompt depth badge', () => {
        renderPromptsView(container);
        const depth = container.querySelector('.prompts-daily .prompt-card__depth');
        expect(depth?.textContent).toBe('Beginner');
    });

    it('renders a "sat with this" button for unseen daily prompt', () => {
        renderPromptsView(container);
        const btn = container.querySelector('.prompts-daily .prompt-card__sat-btn');
        expect(btn).toBeTruthy();
    });

    it('renders a done indicator when daily prompt already sat with', () => {
        vi.mocked(practiceHistory.isPromptSatWith).mockReturnValue(true);
        renderPromptsView(container);
        const done = container.querySelector('.prompts-daily .prompt-card__sat-done');
        expect(done).toBeTruthy();
    });

    it('renders an "All Prompts" browse section', () => {
        renderPromptsView(container);
        const headings = Array.from(
            container.querySelectorAll('.prompts-section__heading'),
        );
        expect(headings.some((h) => h.textContent?.includes('All Prompts'))).toBe(true);
    });

    it('renders concept group headings for each concept', () => {
        renderPromptsView(container);
        const groups = container.querySelectorAll('.prompts-concept-group__title');
        const titles = Array.from(groups).map((g) => g.textContent);
        expect(titles).toContain('anatta');
        expect(titles).toContain('anicca');
    });

    it('renders all prompt cards in the browse section', () => {
        renderPromptsView(container);
        const cards = container.querySelectorAll('.prompt-card');
        // 2 anatta cards + 1 anicca card = 3 browse cards
        expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it('renders depth filter buttons', () => {
        renderPromptsView(container);
        const filterBtns = container.querySelectorAll('.prompts-filter__btn');
        expect(filterBtns.length).toBe(4); // All, Beginner, Intermediate, Advanced
    });

    it('"All" filter button is active by default', () => {
        renderPromptsView(container);
        const allBtn = Array.from(
            container.querySelectorAll('.prompts-filter__btn'),
        ).find((b) => b.getAttribute('data-depth') === 'all');
        expect(allBtn?.classList.contains('btn--active')).toBe(true);
    });

    it('clicking a depth filter updates shown prompts', () => {
        renderPromptsView(container);
        const beginnerBtn = Array.from(
            container.querySelectorAll<HTMLButtonElement>('.prompts-filter__btn'),
        ).find((b) => b.dataset.depth === 'beginner');
        beginnerBtn?.click();

        // Only beginner prompts should be shown (anatta-1 and anicca-1)
        const cards = container.querySelectorAll('.prompt-card');
        expect(cards.length).toBe(2);
    });

    it('clicking sat-with button logs the prompt and shows done indicator', () => {
        renderPromptsView(container);
        const btn = container.querySelector<HTMLButtonElement>(
            '.prompt-card__sat-btn[data-prompt-id="anatta-2"]',
        );
        btn?.click();

        expect(practiceHistory.logPromptSatWith).toHaveBeenCalledWith('anatta-2');
        const done = container.querySelector('.prompt-card__sat-done');
        expect(done).toBeTruthy();
    });

    it('renders guidance details element for each prompt card', () => {
        renderPromptsView(container);
        const details = container.querySelectorAll('.prompt-card__guidance-details');
        expect(details.length).toBeGreaterThan(0);
    });
});
