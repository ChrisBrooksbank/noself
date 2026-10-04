import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderPracticeHistoryView } from './practiceHistoryView.js';

vi.mock('../practiceHistory.js', () => ({
    getMeditationSessions: () => [
        {
            meditationId: 'breath-awareness',
            durationMinutes: 10,
            completedAt: '2026-03-01T09:00:00.000Z',
        },
    ],
    getPromptSessions: () => [
        { promptId: 'anatta-beginner', satWith: '2026-03-01T10:00:00.000Z' },
    ],
    getPathSessions: () => [
        {
            pathId: 'seven-day-metta',
            sessionIndex: 0,
            completedAt: '2026-03-01T08:00:00.000Z',
        },
    ],
    getPujaSessions: () => [
        { pujaId: 'sevenfold-puja', completedAt: '2026-03-01T07:00:00.000Z' },
    ],
    getMantraSessions: () => [
        {
            mantraId: 'avalokiteshvara',
            repetitions: 108,
            completedAt: '2026-03-01T06:00:00.000Z',
        },
    ],
}));

vi.mock('../../content/meditations/loader.js', () => ({
    getMeditationById: (id: string) =>
        id === 'breath-awareness' ? { title: 'Breath Awareness' } : undefined,
}));
vi.mock('../../content/prompts/loader.js', () => ({
    getPromptById: () => undefined,
}));
vi.mock('../../content/paths/loader.js', () => ({
    getPathById: (id: string) =>
        id === 'seven-day-metta' ? { title: 'Seven Days of Metta' } : undefined,
}));
vi.mock('../../content/pujas/loader.js', () => ({
    getPujaById: () => ({ title: 'Sevenfold Puja' }),
}));
vi.mock('../../content/mantras/loader.js', () => ({
    getMantraById: () => undefined,
}));

describe('renderPracticeHistoryView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
    });

    it('renders the heading', () => {
        renderPracticeHistoryView(container);
        expect(container.querySelector('.practice-history__heading')?.textContent).toBe(
            'Practice History',
        );
    });

    it('renders a back link to practice hub', () => {
        renderPracticeHistoryView(container);
        const link = container.querySelector('.back-link');
        expect(link?.getAttribute('href')).toBe('#/practice');
    });

    it('renders history entries', () => {
        renderPracticeHistoryView(container);
        const items = container.querySelectorAll('.history-entry');
        expect(items.length).toBe(5);
    });

    it('renders meditation entry with label and detail', () => {
        renderPracticeHistoryView(container);
        const labels = Array.from(
            container.querySelectorAll('.history-entry__label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('Breath Awareness');
    });

    it('renders meditation detail text with duration', () => {
        renderPracticeHistoryView(container);
        const details = Array.from(
            container.querySelectorAll('.history-entry__detail'),
        ).map((el) => el.textContent);
        expect(details).toContain('10 min meditation');
    });

    it('renders prompt entry label', () => {
        renderPracticeHistoryView(container);
        const labels = Array.from(
            container.querySelectorAll('.history-entry__label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('anatta-beginner');
    });

    it('renders path session entry label', () => {
        renderPracticeHistoryView(container);
        const labels = Array.from(
            container.querySelectorAll('.history-entry__label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('Seven Days of Metta — Session 1');
    });

    it('entries are sorted newest first', () => {
        renderPracticeHistoryView(container);
        const items = Array.from(container.querySelectorAll('.history-entry__label')).map(
            (el) => el.textContent,
        );
        // 10:00 prompt > 09:00 meditation > 08:00 path session
        expect(items[0]).toBe('anatta-beginner');
        expect(items[1]).toBe('Breath Awareness');
        expect(items[2]).toBe('Seven Days of Metta — Session 1');
        expect(items[3]).toBe('Sevenfold Puja');
        expect(items[4]).toBe('avalokiteshvara');
    });

    it('renders entry type classes', () => {
        renderPracticeHistoryView(container);
        expect(container.querySelector('.history-entry--meditation')).toBeTruthy();
        expect(container.querySelector('.history-entry--prompt')).toBeTruthy();
        expect(container.querySelector('.history-entry--path')).toBeTruthy();
        expect(container.querySelector('.history-entry--puja')).toBeTruthy();
        expect(container.querySelector('.history-entry--mantra')).toBeTruthy();
    });

    it('renders mantra repetitions detail', () => {
        renderPracticeHistoryView(container);
        const details = Array.from(
            container.querySelectorAll('.history-entry__detail'),
        ).map((el) => el.textContent);
        expect(details).toContain('108 repetitions');
    });

    it('renders the history list', () => {
        renderPracticeHistoryView(container);
        expect(container.querySelector('.practice-history__list')).toBeTruthy();
    });
});
