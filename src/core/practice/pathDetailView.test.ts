import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPathDetailView } from './pathDetailView.js';
import type { PracticePath } from '../../content/paths/index.js';

const mockPath: PracticePath = {
    id: 'seven-day-metta',
    title: '7-Day Metta',
    description: 'A week of loving-kindness practice.',
    sessions: [
        { day: 1, title: 'Introduction to Metta', conceptId: 'metta' },
        { day: 2, title: 'Metta for Self', meditationId: 'metta' },
        { day: 3, title: 'Expanding Metta', promptId: 'metta-1' },
    ],
};

vi.mock('../../content/paths/loader.js', () => ({
    loadPaths: vi.fn(() => [mockPath]),
    getPathById: vi.fn((id: string) => (id === 'seven-day-metta' ? mockPath : undefined)),
}));

vi.mock('../practiceHistory.js', () => ({
    isPathSessionComplete: vi.fn(() => false),
    logPathSessionComplete: vi.fn(),
}));

import * as practiceHistory from '../practiceHistory.js';

describe('renderPathDetailView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        vi.mocked(practiceHistory.isPathSessionComplete).mockReturnValue(false);
        vi.mocked(practiceHistory.logPathSessionComplete).mockReset();
    });

    it('renders the path title', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const title = container.querySelector('.path-detail__title');
        expect(title?.textContent).toBe('7-Day Metta');
    });

    it('renders the path description', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const desc = container.querySelector('.path-detail__desc');
        expect(desc?.textContent).toBe('A week of loving-kindness practice.');
    });

    it('renders a back link to paths list', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice/paths');
    });

    it('renders a list item for each session', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const items = container.querySelectorAll('.path-session');
        expect(items.length).toBe(3);
    });

    it('renders each session day label', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const days = Array.from(container.querySelectorAll('.path-session__day')).map(
            (el) => el.textContent,
        );
        expect(days).toContain('Day 1');
        expect(days).toContain('Day 2');
        expect(days).toContain('Day 3');
    });

    it('renders each session title', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const titles = Array.from(container.querySelectorAll('.path-session__title')).map(
            (el) => el.textContent,
        );
        expect(titles).toContain('Introduction to Metta');
        expect(titles).toContain('Metta for Self');
        expect(titles).toContain('Expanding Metta');
    });

    it('renders checkboxes for each session', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const checkboxes = container.querySelectorAll('.path-session__checkbox');
        expect(checkboxes.length).toBe(3);
    });

    it('renders unchecked checkboxes when no sessions complete', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const checkboxes = Array.from(
            container.querySelectorAll<HTMLInputElement>('.path-session__checkbox'),
        );
        expect(checkboxes.every((cb) => !cb.checked)).toBe(true);
    });

    it('renders checked checkbox when session is complete', () => {
        vi.mocked(practiceHistory.isPathSessionComplete).mockImplementation(
            (_pathId, index) => index === 0,
        );
        renderPathDetailView(container, 'seven-day-metta');
        const checkboxes = Array.from(
            container.querySelectorAll<HTMLInputElement>('.path-session__checkbox'),
        );
        expect(checkboxes[0]?.checked).toBe(true);
        expect(checkboxes[1]?.checked).toBe(false);
    });

    it('applies done class to completed sessions', () => {
        vi.mocked(practiceHistory.isPathSessionComplete).mockImplementation(
            (_pathId, index) => index === 1,
        );
        renderPathDetailView(container, 'seven-day-metta');
        const sessions = container.querySelectorAll('.path-session--done');
        expect(sessions.length).toBe(1);
    });

    it('renders concept study link for sessions with conceptId', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const links = Array.from(container.querySelectorAll('.path-session__link'));
        const conceptLink = links.find(
            (l) => l.getAttribute('href') === '#/concept/metta',
        );
        expect(conceptLink).toBeTruthy();
    });

    it('renders meditation link for sessions with meditationId', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const links = Array.from(container.querySelectorAll('.path-session__link'));
        const meditateLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/meditate/metta',
        );
        expect(meditateLink).toBeTruthy();
    });

    it('renders contemplate link for sessions with promptId', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const links = Array.from(container.querySelectorAll('.path-session__link'));
        const promptLink = links.find(
            (l) => l.getAttribute('href') === '#/practice/prompts',
        );
        expect(promptLink).toBeTruthy();
    });

    it('renders progress indicator', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const progress = container.querySelector('.path-detail__progress');
        expect(progress).toBeTruthy();
    });

    it('shows "Not started" when no sessions complete', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const label = container.querySelector('.path-item__progress-label');
        expect(label?.textContent).toBe('Not started');
    });

    it('shows "Complete" when all sessions done', () => {
        vi.mocked(practiceHistory.isPathSessionComplete).mockReturnValue(true);
        renderPathDetailView(container, 'seven-day-metta');
        const label = container.querySelector('.path-item__progress-label');
        expect(label?.textContent).toBe('Complete');
    });

    it('renders not-found message for unknown path ID', () => {
        renderPathDetailView(container, 'nonexistent-path');
        const notFound = container.querySelector('.path-detail__not-found');
        expect(notFound?.textContent).toBe('Path not found.');
    });

    it('logs completion when checkbox is checked', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const checkbox = container.querySelector<HTMLInputElement>(
            '.path-session__checkbox[data-session-index="0"]',
        )!;
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        expect(practiceHistory.logPathSessionComplete).toHaveBeenCalledWith(
            'seven-day-metta',
            0,
        );
    });

    it('prevents unchecking completed sessions', () => {
        renderPathDetailView(container, 'seven-day-metta');
        const checkbox = container.querySelector<HTMLInputElement>(
            '.path-session__checkbox[data-session-index="0"]',
        )!;
        // Simulate unchecking
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        // Should be forced back to checked
        expect(checkbox.checked).toBe(true);
    });
});
