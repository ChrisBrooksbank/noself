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
        expect(items.length).toBe(3);
    });

    it('renders meditation entry with label and detail', () => {
        renderPracticeHistoryView(container);
        const labels = Array.from(
            container.querySelectorAll('.history-entry__label'),
        ).map((el) => el.textContent);
        expect(labels).toContain('breath-awareness');
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
        expect(labels).toContain('seven-day-metta — Session 1');
    });

    it('entries are sorted newest first', () => {
        renderPracticeHistoryView(container);
        const items = Array.from(container.querySelectorAll('.history-entry__label')).map(
            (el) => el.textContent,
        );
        // 10:00 prompt > 09:00 meditation > 08:00 path session
        expect(items[0]).toBe('anatta-beginner');
        expect(items[1]).toBe('breath-awareness');
        expect(items[2]).toBe('seven-day-metta — Session 1');
    });

    it('renders entry type classes', () => {
        renderPracticeHistoryView(container);
        expect(container.querySelector('.history-entry--meditation')).toBeTruthy();
        expect(container.querySelector('.history-entry--prompt')).toBeTruthy();
        expect(container.querySelector('.history-entry--path')).toBeTruthy();
    });

    it('renders the history list', () => {
        renderPracticeHistoryView(container);
        expect(container.querySelector('.practice-history__list')).toBeTruthy();
    });
});
